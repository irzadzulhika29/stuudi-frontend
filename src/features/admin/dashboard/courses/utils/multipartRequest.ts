/**
 * Multipart request configuration helper for Axios.
 *
 * When sending FormData (e.g. file uploads), the browser/axios must
 * automatically set the Content-Type header (with the correct multipart
 * boundary). Setting Content-Type manually would replace the boundary
 * and break the upload.
 *
 * Therefore, getMultipartRequestConfig returns `undefined` so axios
 * skips the Content-Type header and the runtime sets it correctly.
 */
export function getMultipartRequestConfig() {
  return undefined;
}
