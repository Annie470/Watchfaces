import { createWidget, widget, align, prop, anim_status } from '@zos/ui'
import { Time, Battery, HeartRate } from '@zos/sensor'

const pad = (n) => String(n).padStart(2, '0')
const GIORNI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab']

const GLOWS_LG = [
  { size: 68, color: 0xFF66BB },
  { size: 67, color: 0xF09EF0 },
  { size: 66, color: 0xFFDDF5 },
]

const GLOWS_XS = [
  { size: 16, color: 0xFF66BB },
  { size: 15, color: 0xF09EF0 },
  { size: 14, color: 0xFFDDF5 },
]

const GLOWS_SM = [
  { size: 21, color: 0xFF66BB },
  { size: 20, color: 0xF09EF0 },
  { size: 19, color: 0xFFDDF5 },
]

WatchFace({
  build() {
    const time = new Time()
    const battery = new Battery()
    let hr = null
    try { hr = new HeartRate() } catch (_) {}

    const bg = createWidget(widget.IMG_ANIM, {
      x: 0, y: 0,
      anim_path: 'frames',
      anim_prefix: 'frame',
      anim_ext: 'png',
      anim_fps: 4,
      anim_size: 6,
      repeat_count: 0,
      anim_status: 3
    })
    bg.setProperty(prop.ANIM_STATUS, anim_status.START)

    // batteria — percentuale + icona in alto
    const BAT_X = 175, BAT_Y = 56

    const glowsBat = GLOWS_XS.map(({ size, color }) =>
      createWidget(widget.TEXT, {
        x: 0, y: 38, w: 390, h: 18,
        color, text_size: size,
        align_h: align.CENTER_H, align_v: align.CENTER_V,
        text: ''
      })
    )
    const batTxt = createWidget(widget.TEXT, {
      x: 0, y: 38, w: 390, h: 18,
      color: 0xFFFFFF, text_size: 14,
      align_h: align.CENTER_H, align_v: align.CENTER_V,
      text: ''
    })

    const batIcon = createWidget(widget.IMG, {
      x: BAT_X, y: BAT_Y,
      src: 'bat0.png'
    })

    // giorno — centro y=145
    const glowsGiorno = GLOWS_SM.map(({ size, color }) =>
      createWidget(widget.TEXT, {
        x: 0, y: 115, w: 390, h: 100,
        color, text_size: size,
        font: 'UnicaOne-Regular.ttf',
        align_h: align.CENTER_H, align_v: align.CENTER_V,
        text: ''
      })
    )
    const giorno = createWidget(widget.TEXT, {
      x: 0, y: 115, w: 390, h: 100,
      color: 0xFFFFFF, text_size: 19,
      font: 'UnicaOne-Regular.ttf',
      align_h: align.CENTER_H, align_v: align.CENTER_V,
      text: ''
    })

    // orario — centro y=225, box alto 110 così il font non viene tagliato sul device
    const glows = GLOWS_LG.map(({ size, color }) =>
      createWidget(widget.TEXT, {
        x: 0, y: 170, w: 390, h: 110,
        color, text_size: size,
        align_h: align.CENTER_H, align_v: align.CENTER_V,
        text: ''
      })
    )
    const ora = createWidget(widget.TEXT, {
      x: 0, y: 170, w: 390, h: 110,
      color: 0xFFFFFF, text_size: 64,
      align_h: align.CENTER_H, align_v: align.CENTER_V,
      text: ''
    })

    // data — centro y=285
    const glowsData = GLOWS_SM.map(({ size, color }) =>
      createWidget(widget.TEXT, {
        x: 0, y: 255, w: 390, h: 60,
        color, text_size: size,
        font: 'UnicaOne-Regular.ttf',
        align_h: align.CENTER_H, align_v: align.CENTER_V,
        text: ''
      })
    )
    const data = createWidget(widget.TEXT, {
      x: 0, y: 255, w: 390, h: 60,
      color: 0xFFFFFF, text_size: 19,
      font: 'UnicaOne-Regular.ttf',
      align_h: align.CENTER_H, align_v: align.CENTER_V,
      text: ''
    })

    // bpm — testo + icona ♥ in basso (speculare alla batteria)
    const glowsBpm = GLOWS_XS.map(({ size, color }) =>
      createWidget(widget.TEXT, {
        x: 0, y: 372, w: 390, h: 18,
        color, text_size: size,
        align_h: align.CENTER_H, align_v: align.CENTER_V,
        text: ''
      })
    )
    const bpmTxt = createWidget(widget.TEXT, {
      x: 0, y: 372, w: 390, h: 18,
      color: 0xFFFFFF, text_size: 14,
      align_h: align.CENTER_H, align_v: align.CENTER_V,
      text: ''
    })
    // cuore esterno ~24×23px — colore outline batteria
    const OC = 0xFFCCFF
    createWidget(widget.FILL_RECT, { x: 185, y: 390, w: 9,  h: 7,  radius: 4, color: OC })
    createWidget(widget.FILL_RECT, { x: 196, y: 390, w: 9,  h: 7,  radius: 4, color: OC })
    createWidget(widget.FILL_RECT, { x: 183, y: 395, w: 24, h: 7,  color: OC })
    createWidget(widget.FILL_RECT, { x: 185, y: 402, w: 20, h: 4,  color: OC })
    createWidget(widget.FILL_RECT, { x: 189, y: 406, w: 12, h: 4,  color: OC })
    createWidget(widget.FILL_RECT, { x: 193, y: 410, w: 4,  h: 3,  color: OC })

    // cuore interno ~14×15px — colore tacche batteria
    const IC = 0xFFFFFF
    createWidget(widget.FILL_RECT, { x: 189, y: 395, w: 5,  h: 4,  radius: 2, color: IC })
    createWidget(widget.FILL_RECT, { x: 195, y: 395, w: 5,  h: 4,  radius: 2, color: IC })
    createWidget(widget.FILL_RECT, { x: 188, y: 398, w: 14, h: 4,  color: IC })
    createWidget(widget.FILL_RECT, { x: 190, y: 402, w: 10, h: 3,  color: IC })
    createWidget(widget.FILL_RECT, { x: 192, y: 405, w: 6,  h: 3,  color: IC })
    createWidget(widget.FILL_RECT, { x: 194, y: 408, w: 2,  h: 2,  color: IC })

    const aggiorna = () => {
      const txtOra = `${pad(time.getHours())}:${pad(time.getMinutes())}`
      glows.forEach(g => g.setProperty(prop.TEXT, txtOra))
      ora.setProperty(prop.TEXT, txtOra)

      const level = battery.getCurrent()
      const txtBat = `${level}%`
      glowsBat.forEach(g => g.setProperty(prop.TEXT, txtBat))
      batTxt.setProperty(prop.TEXT, txtBat)
      const notches = level >= 76 ? 4 : level >= 51 ? 3 : level >= 26 ? 2 : level >= 1 ? 1 : 0
      batIcon.setProperty(prop.SRC, `bat${notches}.png`)

      const txtGiorno = GIORNI[time.getDay()]
      glowsGiorno.forEach(g => g.setProperty(prop.TEXT, txtGiorno))
      giorno.setProperty(prop.TEXT, txtGiorno)

      const txtData = `${pad(time.getDate())}/${pad(time.getMonth())}`
      glowsData.forEach(g => g.setProperty(prop.TEXT, txtData))
      data.setProperty(prop.TEXT, txtData)

    }

    const aggiornaBpm = () => {
      let bpm = 0
      try { bpm = hr ? hr.getCurrent() : 0 } catch (_) {}
      const t = bpm > 0 ? `${bpm}` : '--'
      glowsBpm.forEach(g => g.setProperty(prop.TEXT, t))
      bpmTxt.setProperty(prop.TEXT, t)
    }

    aggiorna()
    time.onPerMinute(aggiorna)
    aggiornaBpm()

    if (hr) {
      try { hr.onCurrentChange(aggiornaBpm) } catch(_) {}
    }
  }
})
