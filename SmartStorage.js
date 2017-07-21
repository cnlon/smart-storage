function SmartStorage (name, storage, max) {
    var type = 'localStorage'
    if (!storage) {
        storage = window.localStorage
    } else if (storage !== window.localStorage) {
        type = 'sessionStorage'
    }
    var prefix = name + SmartStorage.separator
    var instanceId = prefix + type
    if (SmartStorage.instances[instanceId]) {
        return SmartStorage.instances[instanceId]
    }

    SmartStorage.instances[instanceId] = this
    this.name = name
    this.storage = storage
    this.keys = []
    this.length = 0
    this._prefix = prefix
}

SmartStorage.separator = ':'
SmartStorage.instances = {}


var p = SmartStorage.prototype

p.getKeyById = function getKeyById (id) {
    return this._prefix + id
}

p.key = function key (index) {
    return this.keys[index]
}

p.value = function value (index) {
    var id = this.key(index)
    return this._getItem(id)
}

p._has = function _has (key) {
    var raw = this.storage.getItem(key)
    return raw !== undefined
}
p.has = function has (id) {
    var key = this.getKeyById(id)
    return this._has(key)
}

p._getItem = function _getItem (key) {
    var raw = this.storage.getItem(key)
    if (raw === undefined) {
        return raw
    }
    return JSON.parse(raw)
}
p.getItem = p.get = function getItem (id) {
    var key = this.getKeyById(id)
    return this._getItem(key)
}

p.setItem = p.set = function setItem (id, data) {
    if (data === undefined) {
        return
    }
    var key = this.getKeyById(id)
    if (!this._has(key)) {
        this.keys.push(key)
        this.length = this.keys.length
    }
    var raw = JSON.stringify(data)
    this.storage.setItem(key, raw)
}

p._removeItem = function _removeItem (key) {
    this.storage.removeItem(key)
}
p.removeItem = p.remove = function removeItem (id) {
    var key = this.getKeyById(id)
    if (!this._has(key)) {
        return
    }
    this._removeItem(key)
    for (var i = 0, l = this.length; i < l; i++) {
        if (key === this.key[i]) {
            this.keys.splice(i, 1)
            this.length = this.keys.length
            break
        }
    }
}

p.clear = function clear () {
    var length = this.length
    for (var i = 0, key; i < length; i++) {
        key = this.key[i]
        this._removeItem(key)
    }
    this.keys.splice(0, length)
    this.length = 0
}


module.exports = SmartStorage
