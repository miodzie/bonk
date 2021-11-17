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
      this.canvas.getContext('2d').drawImage(this.image, -20, -10)
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
      await sleep(85)
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
  constructor(xStart, yLine, nextSpriteX, xMax) {
    this.xStart = xStart
    this.lineY = yLine
    this.nextSpriteX = nextSpriteX
    this.xMax = xMax

    this.x = xStart
    this.y = yLine
  }

  next() {
    if (Math.sign(this.xMax) == '-1') 
    {
      if (this.x <= this.xMax)
        this.x = this.xStart
    }
    else if (this.x >= this.xMax){
      this.x = this.xStart
    }

    this.x += this.nextSpriteX
    return {
      x: this.x,
      y: this.lineY
    }
  }
}

var jotaro = new Sprite('../dist/sprites/jotaro.png', {width: 100, height: 125});
var run = new Sequence(-20, -10, -125, -800)
document.addEventListener('DOMContentLoaded', function() {
  console.log('やれやれだぜ。')

  jotaro.attach('jotaro')
  jotaro.play(run)

})
