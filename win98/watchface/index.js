import { createWidget, widget, prop, system_status } from '@zos/ui'
import { Time, Battery, HeartRate } from '@zos/sensor'

const pad = (n) => String(n).padStart(2, '0')

// cifre VT323 pre-renderizzate come PNG (il font TTF sul device si rompe):
// t/ orario 48×67, d/ data 16×29, s/ taskbar 10×15
const NOMI = { ':': 'colon', '/': 'slash', '%': 'pct', '-': 'dash', ' ': 'blank' }

// riga di n immagini monospazio; set(testo) aggiorna i caratteri
const riga = (dir, n, x, y, cw) => {
  const imgs = []
  for (let i = 0; i < n; i++) {
    imgs.push(createWidget(widget.IMG, { x: x + i * cw, y, src: `${dir}/blank.png` }))
  }
  return (testo) => {
    const t = testo.padEnd(n, ' ')
    imgs.forEach((img, i) => img.setProperty(prop.SRC, `${dir}/${NOMI[t[i]] || t[i]}.png`))
  }
}

WatchFace({
  build() {
    const time = new Time()
    const battery = new Battery()
    let hr = null
    try { hr = new HeartRate() } catch (_) {}

    // sfondo desktop win98 (il titolo C:\WINDOWS\CLOCK.EXE è già stampato nella barra blu)
    createWidget(widget.IMG, {
      x: 0, y: 0,
      w: 390, h: 450,
      src: 'win98.png'
    })

    // orario grande + data sotto — centrati nel corpo grigio (x 20–366, y 188–372)
    const orario = riga('t', 5, 73, 223, 48)
    const data = riga('d', 10, 113, 308, 16)

    const aggiornaOra = () => {
      orario(`${pad(time.getHours())}:${pad(time.getMinutes())}`)
      data(`${pad(time.getDate())}/${pad(time.getMonth())}/${time.getFullYear()}`)
    }

    aggiornaOra()
    time.onPerMinute(aggiornaOra)

    // cuore + bpm — nella taskbar, a destra di Start
    createWidget(widget.IMG, {
      x: 121, y: 417,
      src: 'heart.png'
    })

    const bpmTxt = riga('s', 3, 151, 422, 10)

    const aggiornaBpm = () => {
      let bpm = 0
      try { bpm = hr ? hr.getCurrent() : 0 } catch (_) {}
      bpmTxt(bpm > 0 ? `${bpm}` : '--')
    }

    aggiornaBpm()
    if (hr) {
      try { hr.onCurrentChange(aggiornaBpm) } catch (_) {}
    }

    // icona batteria — nella taskbar, dove c'era quella dello sfondo
    const batIcon = createWidget(widget.IMG, {
      x: 212, y: 417,
      src: 'bat0.png'
    })

    // percentuale batteria — a destra dell'icona
    const batTxt = riga('s', 4, 264, 422, 10)

    const aggiornaBat = () => {
      const level = battery.getCurrent()
      batTxt(`${level}%`)
      const notches = level >= 76 ? 4 : level >= 51 ? 3 : level >= 26 ? 2 : level >= 1 ? 1 : 0
      batIcon.setProperty(prop.SRC, `bat${notches}.png`)
    }

    aggiornaBat()
    battery.onChange(aggiornaBat)

    // bluetooth — tra percentuale e altoparlante; la B sbarrata copre quella normale quando disconnesso
    createWidget(widget.IMG, {
      x: 311, y: 417,
      src: 'bt_on.png'
    })
    createWidget(widget.IMG_STATUS, {
      x: 311, y: 417,
      type: system_status.DISCONNECT,
      src: 'bt_off.png'
    })
  }
})
