export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function blurMongoCredentials(uri: string) {
  return uri.replace(/:\/\/(.*):(.*)@/, "://****:****@");
}
