function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Jotaro {
  constructor() {
    // ../dist/sprites/jotaro_new.png
    this.sprite = new Sprite(
      browser.extension.getURL('sprites/jotaro_new.png'),
      {width: 97, height: 97}
    );

    this.animations = {
      idle: new SpriteAnimation({
        xStart: 873,
        xEnd: 1358,
        nextSpriteX: 97,
        yOffset: 0,
        fpsBuffer: 7,
        loop: true
      }),
      run: new SpriteAnimation({
        xStart: 0,
        xEnd: 776,
        nextSpriteX: 97,
        yOffset: 0,
        fpsBuffer: 1,
        loop: true
      }),
      punch1: new SpriteAnimation({
        xStart: 1455,
        xEnd: 1649,
        nextSpriteX: 97,
        yOffset: 0,
        fpsBuffer: 2,
        loop: false
      })
    }

    this.sprite.setAnimation(this.animations.idle)
  }

  render(canvas) {
    if(!this.sprite.animation)
      return
    this.sprite.nextFrame()
    this.sprite.render(canvas)
  }

  run() {
    this.sprite.setAnimation(this.animations.run)
  }

  idle() {
    this.sprite.setAnimation(this.animations.idle)
  }

  async punch(forever = false) {
    this.sprite.setAnimation(this.animations.punch1)
    if(!forever) {
      //TODO: this is hacky, bound for trouble later.
      await sleep(200)
      this.idle()
    }
  }

  // TODO: uh
  async bonkImage(imgEle) {
    this.run()
    let distance = imgEle.x - this.sprite.dx - (imgEle.x * .10)
    for(let i = 0; i < distance; i+=10) {
      this.sprite.dx = i
      await sleep(25)
    }
    // Now ora ora attack
    alert('ORA ORA ORA ORA ORA')
    this.punch(true)
    await sleep(100)
    // TODO: kill le image
    imgEle.style.backgroundImage = new URL(imgEle.src)
    imgEle.style.boxShadow = "inset 0 0 99999px rgba(0, 120, 255, 0.5);"
  }
}

class Sprite {
  // imgSrc = path to image file.
  // dimensions = {width: int, height: int}
  constructor(imgSrc, dimensions) {
    this.imgSrc = imgSrc

    this.dimensions = dimensions

    this.sx = 0
    this.sy = 0

    this.dx = 0
    this.dy = 0

    this.image = new Image()
    this.image.src = imgSrc
  }

  render(canvas) {
    let ctx = canvas.getContext('2d')
    ctx.drawImage(
      this.image,
      // sx, sy - we would change sx to change the active sprite
      this.sx, this.sy,
      // sWidth, sHeight (the sprite animation size)
      this.dimensions.width, this.dimensions.height,
      // we would use dx to move the sprite horizontal across the canvas.
      // dx, dy
      this.dx, this.dy,
      // dWidth, dHeight (the sprite animation size)
      this.dimensions.width, this.dimensions.height,
    )
  }

  setAnimation(animation) {
    this.animation = animation
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
    this.loop = opt.loop
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
        this.x = this.xStart
    else if (this.x >= this.xEnd)
      this.x = this.xStart

      this.buffer = 0 

    return frames
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
    ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
    this.sprites.forEach((sprite) => {
      sprite.render(this.canvas)
    })
  }

  async loop() {
    for(;;) {
      this.render()
      await sleep(25)
    }
  }

  get() {
    return this.canvas
  }

  clear() {
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
  }
}

var defaultCanvas = new DefaultCanvas()
var jotaro = new Jotaro();
defaultCanvas.addSprite(jotaro)
var img
document.addEventListener('DOMContentLoaded', function() {
  console.log('やれやれだぜ。')
  console.log(img)
  img = document.getElementById('cat')

  defaultCanvas.attach(document.body)
  defaultCanvas.loop()
  jotaro.idle()

  img = document.getElementsByClassName('mzp-c-split-media-asset')[1]

  jotaro.bonkImage(img)
})

 async function asdf(){
   let acceleration = 1
   let speed = 1
    for (;;) {
      jotaro.potato += speed
      if (speed < 7) {
        speed += acceleration
      }
      await sleep(30)
    }
}
