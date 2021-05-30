/**
 * A timestamp for the moment of now.
 * 
 * @returns an ISO 8601 timestamp for now
 */
module.exports = () => {
  return (new Date()).toISOString();
}