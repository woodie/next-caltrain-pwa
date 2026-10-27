# Development

## Firefox 84

KaiOS 3.1 runs Gecko 84, so Firefox 84 on the Mac is the closest match to the
Nokia 2780 Flip. It lives at `/Applications/Firefox 84.app`, with updates
turned off in `Contents/Resources/distribution/policies.json`, and uses its
own profile so it never touches the regular Firefox's.

```bash
/Applications/Firefox\ 84.app/Contents/MacOS/firefox -no-remote -profile ~/Library/Application\ Support/Firefox84-KaiOS http://localhost:8000/
```

Use `https://next-caltrain-pwa.appspot.com/` instead to try the deployed app.
Opening Firefox 84 from Finder starts a blank profile, not the KaiOS one.

## Phone keys on a Mac

| Phone key             | Mac key    |
| --------------------- | ---------- |
| Left softkey (SELECT) | `[`        |
| Right softkey         | `]`        |
| Call                  | `\`        |
| OK (center)           | Return     |
| Arrows                | Arrow keys |
| Back                  | Esc        |

## Light and dark

The app uses the same palette as the iOS, Android and React apps: the
`--app-*` and `--cal-*` tokens at the top of `webapp/style.css`. Light is the
default, and dark replaces the tokens. Menus, help, About and settings stay
light in both.

| Opened in | Mode |
| --- | --- |
| KaiOS: the installed app or the KaiOS browser | Light from sunrise to sunset, dark otherwise |
| Any other browser | The device's own setting (`prefers-color-scheme`) |
| A browser without that setting | Light |
| Any browser, with `#light` or `#dark` in the URL | That mode |

KaiOS has no light/dark setting, so `NextCaltrain.applyTheme()` sets
`data-theme` on the page from `Sun.isDark()` and rechecks every minute.
`src/Sun.js` computes sunrise and sunset with NOAA's equations for one point
near Palo Alto, with no data to download. Along the line it's within about
4 minutes, worst at Gilroy, which nobody notices at dusk.

To check a mode, add `#light` or `#dark`, for example
`http://localhost:8000/?kaiWeb2#dark`. The page switches without a reload.

## Screenshots

### Any screen

1. In Firefox 84, press ⌥⌘M (Tools → Web Developer → Responsive Design Mode).
2. In the toolbar above the page, set the size to **240** × **320** and
   **DPR** to **1**, so the PNG is 240×320 like the phone.
3. Click once inside the page so it gets your key presses.
4. Go to the screen you want with the keys above.
5. Click the camera icon at the far right of that toolbar. The PNG goes to
   `~/Downloads`.

If the camera icon is missing, widen the window: it sits past the hand
(touch simulation) icon. If it's still missing, turn it on from the toolbar's
⋯ menu.

### Opening screen, from the command line

```bash
/Applications/Firefox\ 84.app/Contents/MacOS/firefox -no-remote -profile "$(mktemp -d)" --screenshot ~/Downloads/kaios-snap-$(date +%Y%m%d-%H%M%S).png --window-size=240,320 https://next-caltrain-pwa.appspot.com/
```

It uses a throwaway profile, so it works while Firefox 84 is open. Firefox
prints a "messages will be lost" error as it quits; the PNG still saves. If
the circle says "Origin to Destination", the schedule hadn't loaded yet; run
it again.

### From a KaiOS 2.5 phone, with WebIDE

The screenshots in `docs/` came from the phones themselves, status bar and
all. WebIDE, in Firefox 59 and earlier, connects to a KaiOS 2.5 phone over
`adb` and saves its whole screen from **Runtime** → **Screenshot**. This is
the only way to get the phone's own status bar in a screenshot.

### Not from the 2780

WebIDE doesn't connect to KaiOS 3.1. Firefox 84's `about:debugging` would,
but only with remote debugging turned on in the phone's settings, which its
menus don't offer. `adb` reaches the jailbroken 2780, but `screencap` hangs:
KaiOS draws the screen itself, without the Android display service that
`screencap` reads. So screenshots of the 2780's screens come from Firefox 84
on the Mac, without the phone's status bar.
