const HTML_CONTENT = 'text/html';

/**
 * Checks if a supplied content type is OK to be processed or not
 * 
 * @param {String} type the content type to check
 * @returns true if the content type is OK, false otherwise
 */
exports.isOKContentType = (type) => {
  return type.indexOf(HTML_CONTENT) > -1;
}