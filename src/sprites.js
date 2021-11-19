function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Jotaro {
  constructor() {
    // TODO: move to a resource class that loads settings from json?
    // ../dist/sprites/jotaro_new.png
    // browser.extension.getURL('sprites/jotaro_new.png')
    this.sprite = new Sprite(
      browser.extension.getURL('sprites/jotaro_new.png'),
      97, 97
    );

    this.animations = {
      idle: new SpriteAnimation({
        xStart: 873,
        xEnd: 1358,
        nextSpriteX: 97,
        yOffset: 0,
        fpsBuffer: 7,
      }),
      run: new SpriteAnimation({
        xStart: 0,
        xEnd: 776,
        nextSpriteX: 97,
        yOffset: 0,
        fpsBuffer: 1,
      }),
      punch1: new SpriteAnimation({
        xStart: 1455,
        xEnd: 1649,
        nextSpriteX: 97,
        yOffset: 0,
        fpsBuffer: 2,
        onComplete: () => {
          this.idle()
        }
      })
    }

    this.sprite.setAnimation(this.animations.idle)
  }

  render(canvas) {
    if (!this.sprite.animation)
      return
    this.sprite.render(canvas)
  }

  run() {
    this.sprite.setAnimation(this.animations.run)
  }

  idle() {
    this.sprite.setAnimation(this.animations.idle)
  }

  punch(onComplete = null) {
    this.sprite.setAnimation(this.animations.punch1, onComplete)
  }

  // TODO: uh
  async bonkImage(imgEle) {
    var yare = new Audio(browser.extension.getURL('sounds/yareyaredaze.ogg'))
    yare.play()
    await sleep(25)
    this.run()
    let rect = imgEle.getBoundingClientRect()
    let distance = rect.left - this.sprite.dx - (rect.left * .10)
    for (let i = 0; i < distance; i += 10) {
      this.sprite.dx = i
      await sleep(25)
    }

    // オラオラオラオラオラオラオラオラオラオラオラオラっ！
    this.punch(() => { })

    var ora = new Audio(browser.extension.getURL('sounds/ORA.ogg'))
    ora.addEventListener('ended', () => {
      let explosion = new Explosion();
      defaultCanvas.addSprite(explosion)
      explosion.sprite.dx = rect.left
      explosion.sprite.dy = rect.top
      explosion.explode().then(() => {
        let bonk = new Audio(browser.extension.getURL('sounds/bonk.ogg'))
        bonk.play()
        this.idle()
        imgEle.remove()
      })
    })
    ora.play()
  }
}

class Sprite {
  // imgSrc = path to image file.
  constructor(imgSrc, width, height) {
    this.imgSrc = imgSrc

    this.width = width
    this.height = height

    this.sx = 0
    this.sy = 0

    this.dx = 0
    this.dy = 0

    this.image = new Image()
    this.image.src = imgSrc

    this.animating = false
  }

  render(canvas) {
    if (this.animating && this.animating != null)
      this.nextFrame()
    let ctx = canvas.getContext('2d')
    ctx.drawImage(
      this.image,
      // sx, sy - we would change sx to change the active sprite
      this.sx, this.sy,
      // sWidth, sHeight (the sprite animation size)
      this.width, this.height,
      // we would use dx to move the sprite horizontal across the canvas.
      // dx, dy
      this.dx, this.dy,
      // dWidth, dHeight (the sprite animation size)
      this.width, this.height,
    )
  }

  setAnimation(animation, onComplete = null, active = true) {
    this.animation = animation
    // TODO: This overrides the underlying animation onComplete
    // and will likely have weird side effects.
    if (onComplete)
      this.animation.onComplete = onComplete
    this.animating = active
  }

  nextFrame() {
    let frames = this.animation.nextFrame()
    this.sx = frames.x
    this.sy = frames.y
  }
}

class SpriteAnimation {
  constructor(opt) {
    this.xStart = opt.xStart
    this.yOffset = opt.yOffset
    this.nextSpriteX = opt.nextSpriteX
    this.xEnd = opt.xEnd
    this.fpsBuffer = opt.fpsBuffer

    this.buffer = 0

    this.x = opt.xStart
    this.y = opt.yLine
    this.onComplete = opt.onComplete
  }

  nextFrame() {
    let frames = {
      x: this.x,
      y: this.yOffset
    }

    if (this.buffer <= this.fpsBuffer) {
      this.buffer++
      return frames
    }

    this.x += this.nextSpriteX

    if (this.xEnd < 0 && this.x <= this.xEnd)
      this.reset()
    else if (this.x >= this.xEnd)
      this.reset()

    this.buffer = 0

    return frames
  }

  reset() {
    this.x = this.xStart
    if (this.onComplete)
      this.onComplete()
  }
}


class DefaultCanvas {
  constructor(sprites = []) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.canvas.id = 'randomly-generated-i-guess'
    this.canvas.style.position = 'fixed'
    this.canvas.style.top = 0
    this.canvas.style.right = 0
    this.canvas.style.bottom = 0
    this.canvas.style.left = 0
    this.canvas.style.zIndex = 9000
    this.canvas.style.pointerEvents = 'none'

    this.sprites = sprites
  }

  addSprite(sprite) {
    this.sprites.push(sprite)
  }

  attach(ele) {
    if (!ele) {
      console.error('given element was null')
      return
    }
    ele.appendChild(this.canvas);
  }


  render() {
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.sprites.forEach((sprite) => {
      sprite.render(this.canvas)
    })
  }

  async loop() {
    for (; ;) {
      this.render()
      await sleep(25)
    }
  }

  get() {
    return this.canvas
  }

  clear() {
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

class Cheems {
  constructor() {
    this.sprite = new Sprite(browser.extension.getURL('sprites/cheems.png'), 205, 137)

    this.animations = {
      idle: new SpriteAnimation({
        xStart: 0,
        xEnd: 205,
        nextSpriteX: 0,
        yOffset: 0,
        fpsBuffer: 7,
      }),
      bonk: new SpriteAnimation({
        xStart: 205,
        xEnd: 411,
        nextSpriteX: 205,
        yOffset: 0,
        fpsBuffer: 2,
        onComplete: () => { this.sprite.animating = false }
      })
    }
    this.sprite.setAnimation(this.animations.idle)
  }

  render(canvas) {
    if (!this.sprite.animation)
      return
    this.sprite.render(canvas)
  }

  bonk() {
    let bonk = new Audio(browser.extension.getURL('sounds/bonk.ogg'))
    bonk.play()
    this.sprite.setAnimation(this.animations.bonk, () => { this.sprite.setAnimation(null) })
  }
}

class Explosion {
  constructor() {
    this.sprite = new Sprite(browser.extension.getURL('sprites/explosion-edit.png'), 165, 165)
  }

  render(canvas) {
    if (!this.sprite.animation)
      return
    this.sprite.nextFrame()
    this.sprite.render(canvas)
  }

  async explode() {
    this.sprite.setAnimation(
      new SpriteAnimation({
        xStart: 0,
        xEnd: 990,
        nextSpriteX: 165,
        yOffset: 0,
        fpsBuffer: 3,
        onComplete: () => {
          this.sprite.setAnimation(null)
        }
      })
    )
  }
}

function NOHORNY(ele) {
  ele.style.cursor = 'pointer'
  ele.removeAttribute('onclick')

  if (ele.parentElement.nodeName == 'A') {
    ele.parentElement.removeAttribute('onclick')
    ele.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false;
    })
    // ele.parentElement.removeEventListener("click")
  }

  ele.addEventListener('click', (e) => {
    e.preventDefault();
    let rect = ele.getBoundingClientRect()
    cheems.sprite.dx = rect.left - (rect.top * .10)
    cheems.sprite.dy = rect.top - (rect.top * .10)
    cheems.bonk()
    let explosion = new Explosion();
    defaultCanvas.addSprite(explosion)
    explosion.sprite.dx = rect.left + 100
    explosion.sprite.dy = rect.top
    explosion.explode().then(setTimeout(() => {
      ele.remove()
      if (ele.parentElement.nodeName == 'A')
        ele.parentElement.remove()
    }, 200))
  });
}

function jotaroBonk(ele) {
  ele.style.cursor = 'pointer'
  ele.removeAttribute('onclick')
  if (ele.parentElement.nodeName == "a")
    ele.parentElement.removeAttribute('onclick')

  console.log(ele.parentElement)
  console.log(ele.parentElement)

  ele.addEventListener('click', (e) => {
    jotaro.bonkImage(ele)
  })
}


var defaultCanvas = new DefaultCanvas()
let cheems = new Cheems()
defaultCanvas.addSprite(cheems)

var jotaro = new Jotaro();
defaultCanvas.addSprite(jotaro)
var img
window.addEventListener('load', (_) => {
  console.log('やれやれだぜ。')

  img = document.getElementById('cat')
  for (let i = 0; i < document.images.length; i++) {
    // jotaroBonk(document.images[i])
    NOHORNY(document.images[i])
  }


  ["div", "body", "td"].forEach((name) => {
    let elements = document.getElementsByTagName(name);
    for (let i = 0; i < elements.length; i++) {
      let e = elements[i];
      if (e.style.background.match("url")) {
        NOHORNY(e)
      }
      if (e.style.backgroundImage.match("url")) {
        NOHORNY(e)
      }
    }
  });

  defaultCanvas.attach(document.body)
  defaultCanvas.loop()
  jotaro.idle()

  img = document.getElementById('cat')
  NOHORNY(img)

  // jotaro.bonkImage(img)
})

async function asdf() {
  let acceleration = 1
  let speed = 1
  for (; ;) {
    jotaro.potato += speed
    if (speed < 7) {
      speed += acceleration
    }
    await sleep(30)
  }
}
