import { MessageFolderImportPolicy } from 'src/modules/messaging/common/standard-objects/message-channel.workspace-entity';
import { MESSAGING_FOLDER_MANAGER_ALWAYS_EXCLUDED_FOLDERS } from 'src/modules/messaging/message-folder-manager/utils/MESSAGING_FOLDER_MANAGER_ALWAYS_EXCLUDED_FOLDERS';
import { type StandardFolder } from 'src/modules/messaging/message-import-manager/drivers/types/standard-folder';

export const shouldSyncFolderByDefault = (
  standardFolder: StandardFolder | null,
  messageFolderImportPolicy: MessageFolderImportPolicy,
): boolean => {
  if (
    standardFolder &&
    MESSAGING_FOLDER_MANAGER_ALWAYS_EXCLUDED_FOLDERS.includes(
      standardFolder as StandardFolder,
    )
  ) {
    return false;
  }

  if (messageFolderImportPolicy === MessageFolderImportPolicy.ALL_FOLDERS) {
    return true;
  }

  return false;
};
