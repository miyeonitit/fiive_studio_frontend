export const config = {
  headers: {
    'Content-Type': 'application/json; charset=utf8',
    Accept: 'application/json',
    'Api-Token': process.env.NEXT_PUBLIC_SENDBIRD_API_TOKEN,
  },
}
