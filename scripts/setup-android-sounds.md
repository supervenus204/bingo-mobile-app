# Android Sound Files Setup

For Android, `react-native-sound` requires sound files to be placed in `android/app/src/main/res/raw/` with lowercase filenames.

## Steps:

1. Copy the following sound files from `src/assets/sounds/` to `android/app/src/main/res/raw/` and rename them:

### Task Complete Sounds:

- `Task Complete/ES_Bubble Effect 04 - Epidemic Sound.mp3` → `task_complete_bubble.mp3`
- `Task Complete/ES_Button Press Click, Tap, Video Game, Main Menu, Select, Positive 02 - Epidemic Sound.mp3` → `task_complete_button.mp3`
- `Task Complete/ES_Mouth, Finger 02 - Epidemic Sound.mp3` → `task_complete_mouth.mp3`
- `Task Complete/ES_Pull Out, Release, Plop - Epidemic Sound.mp3` → `task_complete_plop.mp3`
- `Task Complete/ES_UI Buttons, Bubbly, Option - Epidemic Sound.mp3` → `task_complete_ui.mp3`

### Other Sounds:

- `Start of New Board _ New Week/ES_Holy, Event, Chord - Epidemic Sound.mp3` → `new_board.mp3`
- `Just joined 'Let's Go'/ES_Motion, Graphic, Slide, Interaction, Bright Chord, Warm 04 - Epidemic Sound.mp3` → `lets_go.mp3`
- `Complete Bingo Card Congratulations or Leaderboard/ES_Motion, Game, Jingle, Positive, Event, Chord - Epidemic Sound.mp3` → `complete_card.mp3`

2. After copying the files, rebuild the Android app:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

## Note:

- File names must be lowercase
- Use underscores instead of spaces
- Keep the `.mp3` extension
- Remove old `mark.wav` and `check.wav` files from `res/raw/` if they exist
