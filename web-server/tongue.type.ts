export interface ITongueService {
  postTongueImage(in_file_path: string, out_file_path: string): Promise<void>;
}
