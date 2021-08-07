package simulator

type Event struct {
	Type EventType
}

type EventCallback func(e *Event)

type EventTarget struct {
	listeners map[EventType][]EventCallback
}

func NewEventTarget() *EventTarget {
	return &EventTarget{
		listeners: map[EventType][]EventCallback{},
	}
}

func (l *EventTarget) AddEventListener(eventType EventType, callback EventCallback) {
	listeners, ok := l.listeners[eventType]
	if !ok {
		listeners = []EventCallback{}
	}

	listeners = append(listeners, callback)

	l.listeners[eventType] = listeners
}
func (l *EventTarget) AddEventListeners(eventTypes []EventType, callback EventCallback) {
	for _, eventType := range eventTypes {
		l.AddEventListener(eventType, callback)
	}
}
func (l *EventTarget) DispatchEvent(e *Event) {
	stack, ok := l.listeners[e.Type]
	if !ok {
		return
	}

	for _, cb := range stack {
		cb(e)
	}
}
