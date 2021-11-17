class Jotaro {
  constructor(canvas) {
    this.canvas = canvas

    this.sprite = new Sprite(
      '../dist/sprites/jotaro_new.png',
      {width: 97, height: 97}
    );

    this.animations = {
      idle: new SpriteAnimation({
        xStart: 873,
        xEnd: 1358,
        nextSpriteX: 97,
        yOffset: 0,
        fps: 200,
        loop: true
      }),
      run: new SpriteAnimation({
        xStart: 0,
        xEnd: 776,
        nextSpriteX: 97,
        yOffset: 0,
        fps: 75,
        loop: true
      }),
      punch1: new SpriteAnimation({
        xStart: 1455,
        xEnd: 1649,
        nextSpriteX: 97,
        yOffset: 0,
        fps: 50,
        loop: false
      })
    }
  }

  render(canvas) {
    this.sprite.render(canvas)
  }

  run() {
    this.sprite.play(this.animations.run, this.canvas)
  }

  idle() {
    this.sprite.play(this.animations.idle, this.canvas)
  }

  punch() {
    this.sprite.play(this.animations.punch1, this.canvas)
  }

  async bonkImage(imgEle) {
    this.run()
    let distance = imgEle.x - this.sprite.dx
    for(let i = 0; i < distance; i+=10) {
      this.sprite.dx = i
      await sleep(25)
    }
    // Now ora ora attack
    alert('ORA ORA ORA ORA ORA')
  }

  stop() {
    this.sprite.stop()
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

    this.playing = false
  }

  render(canvas) {
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0,0, canvas.width, canvas.height)
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

  async play(animation, ctx) {
    this.stop()
    let frames = animation.next()
    let initX = frames.x
    this.playing = true;
    while (this.playing) {
      this.sx = frames.x
      this.sy = frames.y
      // TODO: How do I handle rendering?
      this.render(ctx)
      frames = animation.next()
      await sleep(animation.fps)
      if(!animation.loop && this.sx == initX)
        break;
    }
  }

  stop() {
    this.playing = false
  }
}

class SpriteAnimation {
  constructor(opt) {
    this.xStart = opt.xStart
    this.yOffset = opt.yOffset
    this.nextSpriteX = opt.nextSpriteX
    this.xEnd = opt.xEnd
    //NOTE: fps isn't really a true fps, I'm not sure what to call it though.
    this.fps = opt.fps

    this.x = opt.xStart
    this.y = opt.yLine
    this.loop = opt.loop
  }

  next() {
    let frames = {
      x: this.x,
      y: this.yOffset
    }
    this.x += this.nextSpriteX

    if (this.xEnd < 0 && this.x <= this.xEnd) 
        this.x = this.xStart
    else if (this.x >= this.xEnd)
      this.x = this.xStart

    return frames
  }
}


class DefaultCanvas {
  constructor() {
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
  }

  attach(id) {
    let ele = document.getElementById(id)
    if (!ele) {
      console.error(`Canvas: Element not found with id: ${id}`)
      return
    } 
    ele.appendChild(this.canvas);
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
var jotaro = new Jotaro(defaultCanvas.get());
var img
document.addEventListener('DOMContentLoaded', function() {
  console.log('やれやれだぜ。')
  console.log(img)
  img = document.getElementById('cat')

  defaultCanvas.attach('jotaro')
  jotaro.idle()
  // jotaro.run()
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
