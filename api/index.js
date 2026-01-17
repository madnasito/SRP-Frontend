export default async (req, res) => {
  const { reqHandler } = await import('../dist/srp-frontend/server/server.mjs');
  return reqHandler(req, res);
};
