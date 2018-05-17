# LiKo

## About
- Goal: Web service for learning and practicing Korean conversation.
- Team: **Linear Independence**
  - Jungmi Ahn
  - Won Jeongho
  - Seongwoong Kang
  - Hunmin Park

## How to run
- We use GitHub pages.
- Go to <https://linearindependence.github.io/LiKo/>

## Libraries
- JQuery 3.3.1
- Firebase 5.0.2
- Font Awesome
- Google Fonts

## Project structure
- `index.html`: Main entry. (Immediately redirected to `Intro/H_Intro.html`.)
- `Intro`: Intro page.
- `VF`: Virtual friends.
- `VFData`: Virtual friends data.
- `Popup`: Situation selection.
- `ConversationData`: Conversation data.
- `MainPage`: Conversation practice.
- `Test`: Test (Review).
- `Vocablist`: Vocabulary list, vocabulary inspection.
- (Other folders: Not used.)

## Remarks
- Currently, in the situation selection part('Choose the situation
you want to study'), only 'Class' is implemented. In the future,
we'll add more data and enable 'Sick', 'Hobby' and 'Drink', too.
- Currently, if we click `Test`, we test the **most recent** conversation studied by user.
In the future, we'll enable the user to select and test the context and the situation which he/she wants.
