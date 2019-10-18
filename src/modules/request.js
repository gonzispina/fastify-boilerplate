/**
 * Request module
 */

const https = require('https')
const zlib = require('zlib')
const { inherits } = require('util')
const { PassThrough } = require('readable-stream')
const flatstr = require('flatstr')

const defaultHeaders = {
  'Accept-Encoding': 'gzip, deflate'
}

function Request (url, params) {
  PassThrough.call(this, { objectMode: true, highWaterMark: 16 })
  this.error = null
  this.body = null
  return this.makeRequest(url, params)
}

inherits(Request, PassThrough)

/**
 * Write
 *
 * @param      {object}    object    The object
 * @param      {string}    encoding  The encoding
 * @param      {Function}  callback  The callback
 */
// eslint-disable-next-line
Request.prototype._write = function _write(object, encoding, callback) {
  this.push(object) // Passtrough
  callback(this.error, encoding) // Error is null until an error is detected
}

/**
 * Makes a request.
 *
 * @param      {object}  params  The parameters
 * @return     {EventEmitter}  The weather map request
 */
Request.prototype.makeRequest = function makeRequest (url, params) {
  if (!params.headers) {
    params.headers = defaultHeaders
  } else {
    params.headers = { ...defaultHeaders, ...params.headers }
  }

  this.requestPromise = new Promise((resolve) => {
    this.request = https.request(url, params, (response) => {
      this.statusCode = response.statusCode
      this.responseHeaders = response.headers
      this.response = response

      if (this.isResponseCompressed(response)) {
        const gunzip = zlib.createGunzip()
        response.pipe(gunzip).pipe(this, { end: true })
      } else {
        response.pipe(this, { end: true })
      }

      response.on('end', this.destroy)
      resolve(this)
    })

    this.request.on('error', (err) => {
      this.error = err
      this.write(err)
      resolve(this)
    })

    this.request.end()
  })

  return this
}

/**
 * Determines if response compressed.
 *
 * @param      {object}   response  The response
 * @return     {boolean}  True if response compressed, False otherwise.
 */
Request.prototype.isResponseCompressed = function isRequestCompressed (response) {
  if (!response.headers['content-encoding']) return false

  return response.headers['content-encoding'].toLowerCase() === 'gzip'
}

/**
 * Promisifies an stream
 *
 * @param      {boolean}  [json=true]  The json
 * @return     {Promise}  The Request promisified
 */
Request.prototype.toPromise = async function toPromise (json = true) {
  await Promise.resolve(this.requestPromise)
  return new Promise((resolve, reject) => {
    let data = ''
    this.on('readable', () => {
      let chunk = this.read()
      while (chunk !== null) {
        data += chunk.toString()
        chunk = this.read()
      }
    })

    this.on('end', () => {
      if (!data) {
        resolve(this)
        return
      }

      if (this.error) {
        reject(this.error)
        return
      }

      try {
        const res = json ? JSON.parse(flatstr(data)) : data
        this.body = res
        resolve(this)
      } catch (err) {
        reject(err)
      }
    })

    this.on('error', err => reject(err))
  })
}

module.exports = Request
