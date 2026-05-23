export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type DownloadLink = {
  quality: string;
  server_name: string;
  download_url: string;
  file_size: string;
  is_stream: boolean;
};