class Sprite {
  // imgSrc = path to image file.
  // dimensions = {width: int, height: int}
  constructor(imgSrc, dimensions) {
    this.imgSrc = imgSrc

    this.dimensions = dimensions

    this.image = new Image()
    this.image.src = imgSrc

    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
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

  animate(sx, sy, dx, dy) {
    if (!this.canvas) {
      console.error('Sprite: Canvas is null.')
      return
    }
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
    this.canvas.getContext('2d').drawImage(
      this.image,
      // sx, sy - we would change sx to change the active sprite
      sx, sy,
      // sWidth, sHeight (the sprite animation size)
      this.dimensions.width, this.dimensions.height,
      // we would use dx to move the sprite horizontal across the canvas.
      // dx, dy
      dx, dy,
      // dWidth, dHeight (the sprite animation size)
      this.dimensions.width, this.dimensions.height,
    )
  }

  async play(seq) {
    this.potato = 0
    this.stop()
    let frames = seq.next()
    this.playing = true;
    while (this.playing) {
      this.animate(frames.x, frames.y, this.potato, 0)
      frames = seq.next()
      await sleep(seq.fps)
    }
  }

  stop() {
    this.playing = false
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
  xEnd: 776,
  nextSpriteX: 97,
  yOffset: 0,
  fps: 75
})

document.addEventListener('DOMContentLoaded', function() {
  console.log('やれやれだぜ。')

  jotaro.attach('jotaro')
  // jotaro.play(idle)
  jotaro.play(run)



})




 async function asdf(){
   let acceleration = 1
   let speed = 1
    for (;;) {
      jotaro.potato += speed
      if (speed < 10) {
        speed += acceleration
      }
      await sleep(50)
    }
}
