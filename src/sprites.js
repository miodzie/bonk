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
    this.image.onload = () => {
      this.canvas.getContext('2d').drawImage(this.image, -20, -10)
    };
  }

  attach(id) {
    let ele = document.getElementById(id)
    if (!ele) {
      console.error(`Sprite: Element not found with id: ${id}`)
      return
    } 
    ele.appendChild(this.canvas);
  }

  display() {
    console.log('things happened')
  }

  position(x, y) {
    if (!this.canvas) {
      console.error('Sprite: Canvas is null.')
      return
    }
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
    this.canvas.getContext('2d').drawImage(this.image, x, y)
  }

  play(seq) {
    let frames = seq.next()
    this.position(frames.x, frames.y)
    frames = seq.next()
    this.position(frames.x, frames.y)
    frames = seq.next()
    this.position(frames.x, frames.y)
  }
}

class Sequence {
  constructor(xStart, yLine, nextSpriteX) {
    this.lineY = yLine
    this.nextSpriteX = nextSpriteX
    this.x = xStart
    this.y = yLine
  }

  next() {
    // TODO: Add max X, then reset
    this.x += this.nextSpriteX
    return {
      x: this.x,
      y: this.lineY
    }
  }
}

var jotaro = new Sprite('../dist/sprites/jotaro.png', {width: 100, height: 125});
var run = new Sequence(-20, -10, 150)
document.addEventListener('DOMContentLoaded', function() {
  console.log('WE DOING THANGS')

  jotaro.attach('jotaro')
})
