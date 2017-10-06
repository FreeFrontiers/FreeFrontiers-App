'use strict'

;(async () => {
  let markdownit = require('markdown-it')

  let codeMirror
  codeMirror = window.CodeMirror.fromTextArea(document.getElementById('acontent'), {
    mode: 'markdown',
    lineNumbers: true,
    lineWrapping: true
  })
  codeMirror.setOption('theme', '3024-day')
  let ds
  codeMirror.on('change', function () {
    clearTimeout(ds)
    ds = setTimeout(toTextarea(codeMirror.getValue()), 100)
  })
  function toTextarea (content) {
    document.getElementById('acontent').value = content
  }
  document.querySelector('[data-target="previewview"]').addEventListener('click', ($evt) => {
    document.getElementById('previewMarkdown').innerHTML = markdownit().render('# ' +
      document.getElementById('title').value +
      '\n' +
      document.getElementById('description').value +
      '\n\n' +
      document.getElementById('acontent').value) + document.getElementById('tags').value
  })
  document.querySelectorAll('[data-textvalue]').forEach(function ($evt) {
    $evt.addEventListener('dragstart', function ($evt) {
      $evt.dataTransfer.setData('text/plain', $evt.srcElement.dataset.textvalue)
    })
    $evt.addEventListener('touchmove', function ($evt) {
      $evt.dataTransfer.setData('text/plain', $evt.srcElement.dataset.textvalue)
      // $evt.preventDefault()
    })
  })
  document.querySelectorAll('a[data-targetfile]').forEach(function ($el) {
    $el.addEventListener('click', ($evt) => {
      let $target = $el.dataset.targetfile
      if (document.querySelectorAll('[data-file]')[document.querySelectorAll('[data-file]').length - 1] !== document.querySelector('[data-file="' + $target + '"]')) lowerCounter()
      console.log(document.querySelectorAll('[data-file]')[document.querySelectorAll('[data-file]').length - 1], document.querySelector('[data-file="' + $target + '"]'))
      document.querySelector('[data-file="' + $target + '"]').parentNode.removeChild(document.querySelector('[data-file="' + $target + '"]'))
      document.querySelector('[data-targetfile="' + $target + '"]').parentNode.parentNode.parentNode.parentNode.removeChild(document.querySelector('[data-targetfile="' + $target + '"]').parentNode.parentNode.parentNode)
      if (counter > 0) counter--
    })
  })
  function isEquivalent (a, b) {
  // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a)
    let bProps = Object.getOwnPropertyNames(b)

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false
    }

    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i]

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true
  }
  let counter
  if (document.querySelectorAll('[data-file]').length > 0) counter = document.querySelectorAll('[data-file]').length
  else counter = 0
  function newUpload ($file, type) {
    let file = document.createElement('input')
    file.type = 'file'
    file.setAttribute('class', 'is-hidden')
    // file.classList.add('file-input')
    file.setAttribute('data-file', $file[0].name)
    file.setAttribute('data-path', $file[0].path)
    file.setAttribute('data-type', type)
    file.setAttribute('name', 'file' + counter)
    file.style.display = 'none'
    file.files = $file
    document.getElementById('articlenew').appendChild(file)
  }
  function lowerCounter () {
    document.querySelectorAll('[data-attachmentval]').forEach(function ($el) {
      if ($el.dataset.attachmentval > 0) {
        $el.dataset.attachmentval -= 1
        $el.innerText = 'Attachment:' + Number($el.dataset.attachmentval)
      }
    })
  }
  function newPreview ($file, type) {
    let column = document.createElement('div')
    column.setAttribute('class', 'column')
    column.classList.add('is-narrow')
    /**
       *  div .card
       *    div .card-header
       *      p .card-header-title [data-attachmentval]
       *    div .card-image
       *      figure
       *        img .image .is-128x128 [src]
       *    div .card-footer
       *      a .card-footer-item [data-targetfile]
       */
    let card = document.createElement('div')
    card.setAttribute('class', 'card')
    let cardHeader = document.createElement('div')
    cardHeader.setAttribute('class', 'card-header')
    let headerTitle = document.createElement('p')
    headerTitle.setAttribute('class', 'card-header-title')
    headerTitle.innerText = 'Attachment:' + counter
    headerTitle.setAttribute('data-attachmentval', counter)
    let cardImage = document.createElement('div')
    cardImage.setAttribute('class', 'card-image')
    cardImage.classList.add('is-200x200')
    let figure = document.createElement('figure')
    figure.style.width = '200px'
    figure.style.height = '200px'
    let cardFooter = document.createElement('div')
    cardFooter.setAttribute('class', 'card-footer')
    let a = document.createElement('a')
    a.setAttribute('data-targetfile', $file[0].name)
    a.classList.add('card-footer-item')
    a.innerText = 'Delete'
    cardHeader.appendChild(headerTitle)
    card.appendChild(cardHeader)
    switch (type) {
      case 'image':
        let img = document.createElement('img')
        img.src = $file[0].path
        img.setAttribute('class', 'image')
        img.classList.add('responsive-200x200')
        figure.setAttribute('title', 'Image file')
        figure.appendChild(img)
        break
      case 'video':
        let i = document.createElement('i')
        i.setAttribute('data-feather', 'video')
        let vp = document.createElement('p')
        vp.innerText = $file[0].name
        figure.setAttribute('title', 'Video file')
        figure.appendChild(i)
        figure.appendChild(vp)
        break
      case 'text':
        let ii = document.createElement('i')
        ii.setAttribute('data-feather', 'file-text')
        let tp = document.createElement('p')
        tp.innerText = $file[0].name
        tp.style.wordWrap = 'normal'
        figure.setAttribute('title', 'Video file')
        figure.appendChild(ii)
        figure.appendChild(tp)
        break
      default:
        let iii = document.createElement('i')
        iii.setAttribute('data-feather', 'file')
        let p = document.createElement('p')
        p.innerText = $file[0].name
        p.style.wordWrap = 'normal'
        figure.setAttribute('title', 'File')
        figure.appendChild(iii)
        figure.appendChild(p)
        break
    }
    cardImage.appendChild(figure)
    card.appendChild(cardImage)
    cardFooter.appendChild(a)
    card.appendChild(cardFooter)
    column.appendChild(card)
    document.getElementById('preview').appendChild(column)
    counter++
    a.addEventListener('click', function ($evt) {
      let $target = $evt.srcElement.dataset.targetfile
      if (document.querySelectorAll('[data-file]')[document.querySelectorAll('[data-file]').length - 1] !== document.querySelector('[data-file="' + $target + '"]')) lowerCounter()
      console.log(document.querySelectorAll('[data-file]')[document.querySelectorAll('[data-file]').length - 1], document.querySelector('[data-file="' + $target + '"]'))
      document.querySelector('[data-file="' + $target + '"]').parentNode.removeChild(document.querySelector('[data-file="' + $target + '"]'))
      document.querySelector('[data-targetfile="' + $target + '"]').parentNode.parentNode.parentNode.parentNode.removeChild(document.querySelector('[data-targetfile="' + $target + '"]').parentNode.parentNode.parentNode)
      if (counter > 0) counter--
    })
    document.getElementById('manualinputfile').type = ''
    document.getElementById('manualinputfile').type = 'file'
    window.feather.replace()
  }
  function handleFileSelect (evt) {
    evt.stopPropagation()
    evt.preventDefault()
    if (evt.srcElement.type) {
      let files = evt.srcElement.files
      console.log(files)
      let type
      if (files[0].type.match('image.*')) {
        type = 'image'
      } else if (files[0].type.match('video.*')) {
        type = 'video'
      } else if (files[0].type.match('audio.*')) {
        type = 'audio'
      } else if (files[0].type.match('text.*')) {
        type = 'text'
      } else if (files[0].type.match('application/pdf')) {
        type = 'download'
      } else return console.log('Not supported.')
      let theFile = {
        name: evt.srcElement.files[0].name,
        size: evt.srcElement.files[0].size,
        lastModified: evt.srcElement.files[0].lastModified
      }
      let uploadedFiles = document.querySelectorAll('[type="file"][data-file]')
      let compareWith = []
      for (let i = 0; i < uploadedFiles.length; i++) {
        let element = uploadedFiles[i]
        compareWith.push({name: element.files[0].name, size: element.files[0].size, lastModified: element.files[0].lastModified})
      }
      let exists = false
      for (let i = 0; i < compareWith.length; i++) {
        let compareElement = compareWith[i]
        if (isEquivalent(compareElement, theFile)) exists = true
      }
      if (!exists) {
        newUpload(files, type)
        newPreview(files, type)
      } else console.log('Exists. Not creating new form for file.')
    }
  }
  function handleDragOver (evt) {
    evt.stopPropagation()
    evt.preventDefault()
    evt.dataTransfer.dropEffect = 'copy' // Explicitly show this is a copy.
  }
  // Setup the dnd listeners.
  let dropZone = document.getElementById('drop_zone')
  dropZone.addEventListener('dragover', handleDragOver, false)
  dropZone.addEventListener('drop', handleFileSelect, false)
  document.getElementById('manualinputfile').addEventListener('change', handleFileSelect)
})()
