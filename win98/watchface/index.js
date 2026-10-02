import { createWidget, widget, align, prop, system_status } from '@zos/ui'
import { Time, Battery, HeartRate } from '@zos/sensor'

const pad = (n) => String(n).padStart(2, '0')

WatchFace({
  build() {
    const time = new Time()
    const battery = new Battery()
    let hr = null
    try { hr = new HeartRate() } catch (_) {}

    // sfondo desktop win98
    createWidget(widget.IMG, {
      x: 0, y: 0,
      w: 390, h: 450,
      src: 'win98.png'
    })

    // titolo finestra — percorso nella barra blu, prima della X
    createWidget(widget.TEXT, {
      x: 28, y: 146, w: 296, h: 42,
      color: 0xFFFFFF, text_size: 34,
      font: 'VT323-Regular.ttf',
      align_h: align.LEFT, align_v: align.CENTER_V,
      text: 'C:\\WINDOWS\\CLOCK.EXE'
    })

    // orario grande — nel corpo grigio della finestra
    const orario = createWidget(widget.TEXT, {
      x: 20, y: 196, w: 346, h: 120,
      color: 0x000000, text_size: 120,
      font: 'VT323-Regular.ttf',
      align_h: align.CENTER_H, align_v: align.CENTER_V,
      text: ''
    })

    // data — sotto l'orario
    const data = createWidget(widget.TEXT, {
      x: 20, y: 312, w: 346, h: 44,
      color: 0x000000, text_size: 40,
      font: 'VT323-Regular.ttf',
      align_h: align.CENTER_H, align_v: align.CENTER_V,
      text: ''
    })

    const aggiornaOra = () => {
      orario.setProperty(prop.TEXT, `${pad(time.getHours())}:${pad(time.getMinutes())}`)
      data.setProperty(prop.TEXT,
        `${pad(time.getDate())}/${pad(time.getMonth())}/${time.getFullYear()}`)
    }

    aggiornaOra()
    time.onPerMinute(aggiornaOra)

    // cuore + bpm — nella taskbar, a destra di Start
    createWidget(widget.IMG, {
      x: 121, y: 417,
      src: 'heart.png'
    })

    const bpmTxt = createWidget(widget.TEXT, {
      x: 151, y: 415, w: 46, h: 28,
      color: 0x000000, text_size: 26,
      font: 'VT323-Regular.ttf',
      align_h: align.LEFT, align_v: align.CENTER_V,
      text: ''
    })

    const aggiornaBpm = () => {
      const bpm = hr ? hr.getCurrent() : 0
      bpmTxt.setProperty(prop.TEXT, bpm > 0 ? `${bpm}` : '--')
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
    const batTxt = createWidget(widget.TEXT, {
      x: 264, y: 415, w: 92, h: 28,
      color: 0x000000, text_size: 26,
      font: 'VT323-Regular.ttf',
      align_h: align.LEFT, align_v: align.CENTER_V,
      text: ''
    })

    const aggiornaBat = () => {
      const level = battery.getCurrent()
      batTxt.setProperty(prop.TEXT, `${level}%`)
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
