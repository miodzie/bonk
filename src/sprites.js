class Sprite {
  // imgSrc = path to image file.
  // dimensions = {width: int, height: int}
  constructor(imgSrc, dimensions) {
    this.imgSrc = imgSrc

    this.dimensions = dimensions

    this.image = new Image()
    this.image.src = imgSrc
    this.image.width = dimensions.width
    this.image.height = dimensions.height

    this.canvas = document.createElement('canvas')
    this.canvas.width = dimensions.width
    this.canvas.height = dimensions.height
    this.canvas.id = 'randomly-generated-i-guess'
    this.canvas.style.position = 'fixed'
    this.canvas.style.zIndex = 9000
    this.image.onload = () => {
      this.canvas.getContext('2d').drawImage(this.image, -30, -10)
    };

    this.playing = false
  }

  attach(id) {
    let ele = document.getElementById(id)
    if (!ele) {
      console.error(`Sprite: Element not found with id: ${id}`)
      return
    } 
    ele.appendChild(this.canvas);
  }

  animate(x, y) {
    if (!this.canvas) {
      console.error('Sprite: Canvas is null.')
      return
    }
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
    this.canvas.getContext('2d').drawImage(this.image, x, y)
  }

  async play(seq) {
    this.stop()
    let frames = seq.next()
    this.playing = true;
    while (this.playing) {
      this.animate(frames.x, frames.y)
      frames = seq.next()
      await sleep(seq.fps)
    }
  }

  stop() {
    this.playing = false
  }

  move(x, y) {
    let cX = parseInt(this.canvas.style.left)
    let cY = parseInt(this.canvas.style.top)
    if (!cX)
      cX = 0
    if (!cY)
      cY = 0

    this.pos(cX + x, cY + y)
  }

  pos(x, y) {
    this.canvas.style.left = x + "px"
    this.canvas.style.top = y + "px"
  }
}

class Sequence {
  constructor(opt) {
    this.xStart = opt.xStart
    this.yOffset = opt.yOffset
    this.nextSpriteX = opt.nextSpriteX
    this.xEnd = opt.xEnd
    //NOTE: fps isn't really a true fps, I'm not sure what to call it though.
    this.fps = opt.fps

    this.x = opt.xStart
    this.y = opt.yLine
  }

  next() {
    console.log(this.x)
    let frames = {
      x: this.x,
      y: this.yOffset
    }
    this.x += this.nextSpriteX
    if (Math.sign(this.xEnd) == '-1') 
    {
      if (this.x <= this.xEnd)
        this.x = this.xStart
    }
    else if (this.x >= this.xEnd){
      this.x = this.xStart
    }

    return frames
  }
}

var jotaro = new Sprite('../dist/sprites/jotaro_run.png', {width: 97, height: 97});
var run = new Sequence({
  xStart: 0,
  xEnd: -776,
  nextSpriteX: -97,
  yOffset: 0,
  fps: 100
})

var idle = new Sequence({
  xStart: -520,
  xEnd: -780,
  nextSpriteX: -130,
  yOffset: -1040,
  fps: 250
})

document.addEventListener('DOMContentLoaded', function() {
  console.log('やれやれだぜ。')

  jotaro.attach('jotaro')
  // jotaro.play(idle)
  jotaro.play(run)
})
