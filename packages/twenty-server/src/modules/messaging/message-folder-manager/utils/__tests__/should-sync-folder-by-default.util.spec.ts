import { MessageFolderImportPolicy } from 'src/modules/messaging/common/standard-objects/message-channel.workspace-entity';
import { shouldSyncFolderByDefault } from 'src/modules/messaging/message-folder-manager/utils/should-sync-folder-by-default.util';
import { StandardFolder } from 'src/modules/messaging/message-import-manager/drivers/types/standard-folder';

describe('shouldSyncFolderByDefault', () => {
  describe('when messageFolderImportPolicy is SELECTED_FOLDERS', () => {
    it('should not sync inbox folder by default', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.SELECTED_FOLDERS,
        StandardFolder.INBOX,
      );

      expect(result).toBe(false);
    });

    it('should not sync sent folder by default', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.SELECTED_FOLDERS,
        StandardFolder.SENT,
      );

      expect(result).toBe(false);
    });

    it('should not sync custom folders by default', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.SELECTED_FOLDERS,
      );

      expect(result).toBe(false);
    });

    it('should never sync drafts folder even when manually selected', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.SELECTED_FOLDERS,
        StandardFolder.DRAFTS,
      );

      expect(result).toBe(false);
    });

    it('should never sync trash folder even when manually selected', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.SELECTED_FOLDERS,
        StandardFolder.TRASH,
      );

      expect(result).toBe(false);
    });

    it('should never sync junk/spam folder even when manually selected', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.SELECTED_FOLDERS,
        StandardFolder.JUNK,
      );

      expect(result).toBe(false);
    });
  });

  describe('when messageFolderImportPolicy is ALL_FOLDERS', () => {
    it('should sync inbox folder', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.ALL_FOLDERS,
        StandardFolder.INBOX,
      );

      expect(result).toBe(true);
    });

    it('should sync sent folder', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.ALL_FOLDERS,
        StandardFolder.SENT,
      );

      expect(result).toBe(true);
    });

    it('should sync custom folders', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.ALL_FOLDERS,
      );

      expect(result).toBe(true);
    });

    it('should NOT sync drafts folder even with ALL_FOLDERS policy', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.ALL_FOLDERS,
        StandardFolder.DRAFTS,
      );

      expect(result).toBe(false);
    });

    it('should NOT sync trash folder even with ALL_FOLDERS policy', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.ALL_FOLDERS,
        StandardFolder.TRASH,
      );

      expect(result).toBe(false);
    });

    it('should NOT sync junk/spam folder even with ALL_FOLDERS policy', () => {
      const result = shouldSyncFolderByDefault(
        MessageFolderImportPolicy.ALL_FOLDERS,
        StandardFolder.JUNK,
      );

      expect(result).toBe(false);
    });
  });

  describe('real-world scenarios', () => {
    describe('Microsoft Outlook user', () => {
      it('should sync inbox and sent with ALL_FOLDERS policy', () => {
        const inboxResult = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.INBOX,
        );
        const sentResult = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.SENT,
        );

        expect(inboxResult).toBe(true);
        expect(sentResult).toBe(true);
      });

      it('should not sync deleted items (trash) folder', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.TRASH,
        );

        expect(result).toBe(false);
      });

      it('should not sync junk email folder', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.JUNK,
        );

        expect(result).toBe(false);
      });

      it('should sync custom project folders with ALL_FOLDERS policy', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
        );

        expect(result).toBe(true);
      });
    });

    describe('Gmail user', () => {
      it('should not sync spam folder', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.JUNK,
        );

        expect(result).toBe(false);
      });

      it('should not sync trash folder', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.TRASH,
        );

        expect(result).toBe(false);
      });

      it('should not sync drafts folder', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.DRAFTS,
        );

        expect(result).toBe(false);
      });

      it('should sync custom labels with ALL_FOLDERS policy', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
        );

        expect(result).toBe(true);
      });
    });

    describe('IMAP user (generic email provider)', () => {
      it('should sync inbox with ALL_FOLDERS policy', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.INBOX,
        );

        expect(result).toBe(true);
      });

      it('should sync sent folder with ALL_FOLDERS policy', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.SENT,
        );

        expect(result).toBe(true);
      });

      it('should not sync trash folder', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.TRASH,
        );

        expect(result).toBe(false);
      });

      it('should not sync spam folder', () => {
        const result = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.ALL_FOLDERS,
          StandardFolder.JUNK,
        );

        expect(result).toBe(false);
      });
    });

    describe('selective sync mode', () => {
      it('should require manual selection for all folders with SELECTED_FOLDERS policy', () => {
        const inboxResult = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.SELECTED_FOLDERS,
          StandardFolder.INBOX,
        );
        const sentResult = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.SELECTED_FOLDERS,
          StandardFolder.SENT,
        );
        const customResult = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.SELECTED_FOLDERS,
        );

        expect(inboxResult).toBe(false);
        expect(sentResult).toBe(false);
        expect(customResult).toBe(false);
      });

      it('should still never sync excluded folders even if user tries to select them', () => {
        const draftsResult = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.SELECTED_FOLDERS,
          StandardFolder.DRAFTS,
        );
        const trashResult = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.SELECTED_FOLDERS,
          StandardFolder.TRASH,
        );
        const junkResult = shouldSyncFolderByDefault(
          MessageFolderImportPolicy.SELECTED_FOLDERS,
          StandardFolder.JUNK,
        );

        expect(draftsResult).toBe(false);
        expect(trashResult).toBe(false);
        expect(junkResult).toBe(false);
      });
    });
  });
});
