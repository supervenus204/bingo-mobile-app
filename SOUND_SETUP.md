# Sound Setup Instructions

The app now uses new MP3 sound files for interactive feedback. Follow these steps to ensure sounds work on both iOS and Android.

## iOS Setup

iOS should work automatically as the sound files are referenced via `require()` statements. However, you may need to:

1. **Clean and rebuild**:

   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

2. **Verify files are in Xcode project**:
   - Open `ios/HealthBingo.xcodeproj` in Xcode
   - Check that sound files appear in the project navigator under `HealthBingo > assets > sounds`
   - If missing, drag the `src/assets/sounds` folder into Xcode

## Android Setup

Android requires sound files to be in `android/app/src/main/res/raw/` with specific naming.

### Automatic Setup (Recommended)

Run the setup script:

```bash
npm run setup-android-sounds
```

This will:

- Copy all sound files to the correct Android location
- Rename them to lowercase with underscores
- Remove old `mark.wav` and `check.wav` files

### Manual Setup

1. Copy sound files from `src/assets/sounds/` to `android/app/src/main/res/raw/` with these names:

   **Task Complete:**

   - `task_complete_bubble.mp3`
   - `task_complete_button.mp3`
   - `task_complete_mouth.mp3`
   - `task_complete_plop.mp3`
   - `task_complete_ui.mp3`

   **Other Sounds:**

   - `new_board.mp3`
   - `lets_go.mp3`
   - `complete_card.mp3`

2. Remove old files:

   - Delete `mark.wav` and `check.wav` from `res/raw/` if they exist

3. Rebuild:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

## Testing

After setup, test sounds by:

1. Marking a bingo task (should hear task complete sound)
2. Checking a card (should hear task complete sound)
3. Opening a new week board (should hear new board sound)
4. Joining a challenge (should hear "Let's Go" sound)
5. Completing full bingo card (should hear celebration sound)

## Debugging

If sounds don't work:

1. **Check console logs** (in development mode):

   - Look for `[Sound]` prefixed messages
   - Verify files are loading: `[Sound] Loaded: ...`
   - Check for errors: `[Sound] Failed to load: ...`

2. **Verify file paths**:

   - iOS: Files should be in `src/assets/sounds/`
   - Android: Files should be in `android/app/src/main/res/raw/` with correct names

3. **Check device volume**:

   - Ensure device volume is not muted
   - Check app permissions (if required)

4. **Rebuild the app**:
   - Clean build folders and rebuild completely

## Sound Files Reference

- **Task Complete** (5 rotating sounds): Short pops/button sounds for marking tasks
- **New Board/Week**: Plays when opening a weekly card for the first time
- **Let's Go**: Whoosh/motion sound for starting a challenge
- **Complete Card**: Celebratory sound for completing a full bingo card
