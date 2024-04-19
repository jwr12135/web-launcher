export default function parseStorageData(data: any): Config | undefined {
  try {
    if (data?.sourcetab) {
      return data as Config;
    }
  } catch (error: unknown) {
    console.error(error);
  }
}
