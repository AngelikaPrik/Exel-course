import { IStore } from '@core/createStore'
import { StoreSubscriber } from '@core/StoreSubscriber'
import { Emitter } from '@core/Emitter'
import { $ } from '@core/dom'
import { updateDate } from '@redux/actions'
import { preventDefault } from '@core/utils'

export class Excel {
  components: any[]
  store: IStore
  emitter: Emitter
  subscriber: StoreSubscriber

  constructor(options: IOptions) {
    this.components = options.components || []
    this.store = options.store
    this.emitter = new Emitter()
    this.subscriber = new StoreSubscriber(this.store)
  }

  getRoot() {
    const $root = $.create('div', 'excel')

    const componentOptions = {
      emitter: this.emitter,
      store: this.store,
    }

    this.components = this.components.map(Component => {
      const $el = $.create('div', Component.className)
      const component = new Component($el, componentOptions)
      $el.html(component.toHTML())
      $root.append($el)

      return component
    })

    return $root
  }

  init() {
    if(process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', preventDefault)
    }

    this.store.dispatch(updateDate())
    this.subscriber.subscribeComponents(this.components)
    this.components.forEach(component => component.init())
  }

  destroy() {
    this.subscriber.unsubscribeFromStore()
    this.components.forEach(component => component.destroy())
    document.removeEventListener('contextmenu', preventDefault)
  }
}

interface IOptions {
  components: any[]
  store: IStore
}
