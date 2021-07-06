package simulator

import "math/rand"

type EventType string

const (
	EventNormalAttack   = "normal-attack"
	EventChargeAttack   = "charge-attack"
	EventElementalSkill = "elemental-skill"
	EventElementalBurst = "elemental-burst"
)

type Event struct {
	Type EventType
}

type EventCallback func(e *Event)

type EventTarget struct {
	listeners map[EventType][]EventCallback
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

type Simulation struct {
	EventTarget

	Frame  int
	Random rand.Rand
}
