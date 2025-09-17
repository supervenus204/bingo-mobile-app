export const parseJsonSafe = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};
