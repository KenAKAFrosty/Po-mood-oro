# Core Features:

- Traditional Pomodoro timer (25/5 minute intervals)
- Prompt for mood(s) after each session
- Optionally keep context of current task(s) during working session
- Optional quick notes field
- Daily/weekly/task-level visualization of:
    - Mood trends
    - Completion rates
    - Time of day patterns


# Goals (roughly in order of importance)
- Refine understanding and use of [Effect](https://effect.website), particularly clientside in the browser
- Keeping scope of the app itself minimal, aimed to be a "do it in a weekend" project
    - This is a learning & exploratory project, so the actual time spent may be more than just a weekend. But the point is the scope of the &*app's functionality* is small enough to be a weekend project.
- Focus on local-only (but without closing off a way to eventually sync with a server)
    - ^ related to that, wanting to use and understand the IndexedDB API  
    - Note this is also in part because Effect's utility and implementation on the backend was much more immediately clear to start with. It's the local clientside stuff that I've had a harder time getting into.
- Managing scope (no creep!)
- Make it inuitive and user friendly so I can use it in my day-to-day (HOWEVER, look at at the NOT Goals section!)
- Refine knowledge of little edge cases, particularly around tightening up strictness of types
- Look into, understand, and use a data visualization library that isn't D3 and has great typescript support
- Oh, and did I say managing scope?

# NOT Goals
- Aesthetics. As noted above, I want it to be inutitive, clear, easy to use. But I don't intend to make it look pretty (managing scope here). A decent font and generous whitespacing is about all I'm going to aim for.
- Explaining the UI/Templating/Web Framework, which is Qwik: [Qwik Docs](https://qwik.dev/). That said, it's JSX-based and has a lot of similarities to React and Solid. With the simplicity of the app and tight scope of this project, there shouldn't be anything too surprising.