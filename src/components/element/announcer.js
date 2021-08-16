export const Announcer = (topics, events, options) => {
  const url = 'wss://announcer.mol.net.ua'
  const ws = new WebSocket(url)
  ws.onopen = () => {
    topics.forEach(el => {
      ws.send(JSON.stringify({ type: 'subscribe', topic: el }))
    })
    if (options.onOpen) {
      options.onOpen()
    }
  }

  ws.onclose = options.onClose || null
  ws.onerror = options.onError || null

  ws.onmessage = (ev) => {
    const message = JSON.parse(ev.data)
    const topic = message.topic
    delete message.topic

    if (events[topic]) {
      events[topic](message)
    }
  }

  return ws
}

export const Connect = (wss, toast, announcerEvents) => {
  wss = new Announcer(['poller.*', 'announcer.*'], announcerEvents, {
    onOpen: () => {
      // toast.info('Уведомления включены', { timeout: 3000 })
    },
    onError: (err) => {
      toast.info('wssError' + err)
      console.log('wssError' + err)
    },
    onClose: () => {
      // toast.info('Соединение с сервером потеряно. Уведомления будут недоступны')
      console.log('Соединение с сервером потеряно. Реконнект')
      Connect(wss, toast, announcerEvents)
    }
  })
}
