
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.43.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (251:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src/component/SelectMixmode.svelte generated by Svelte v3.43.1 */
    const file$6 = "src/component/SelectMixmode.svelte";

    function create_fragment$6(ctx) {
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let option14;
    	let option15;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "通常（normal）";
    			option1 = element("option");
    			option1.textContent = "比較（暗）（darken）";
    			option2 = element("option");
    			option2.textContent = "乗算（multiply）";
    			option3 = element("option");
    			option3.textContent = "焼き込み（color-burn）";
    			option4 = element("option");
    			option4.textContent = "比較（明）（lighten）";
    			option5 = element("option");
    			option5.textContent = "スクリーン（screen）";
    			option6 = element("option");
    			option6.textContent = "覆い焼き（color-dodge）";
    			option7 = element("option");
    			option7.textContent = "オーバーレイ（overlay）";
    			option8 = element("option");
    			option8.textContent = "ソフトライト（soft-light）";
    			option9 = element("option");
    			option9.textContent = "ハードライト（hard-light）";
    			option10 = element("option");
    			option10.textContent = "差の絶対値（difference）";
    			option11 = element("option");
    			option11.textContent = "除外（exclusion）";
    			option12 = element("option");
    			option12.textContent = "色相（hue）";
    			option13 = element("option");
    			option13.textContent = "彩度（saturation）";
    			option14 = element("option");
    			option14.textContent = "カラー（color）";
    			option15 = element("option");
    			option15.textContent = "輝度（luminosity）";
    			option0.__value = "normal";
    			option0.value = option0.__value;
    			add_location(option0, file$6, 13, 2, 278);
    			option1.__value = "darken";
    			option1.value = option1.__value;
    			add_location(option1, file$6, 14, 2, 323);
    			option2.__value = "multiply";
    			option2.value = option2.__value;
    			add_location(option2, file$6, 15, 2, 371);
    			option3.__value = "color-burn";
    			option3.value = option3.__value;
    			add_location(option3, file$6, 16, 2, 420);
    			option4.__value = "lighten";
    			option4.value = option4.__value;
    			add_location(option4, file$6, 17, 2, 475);
    			option5.__value = "screen";
    			option5.value = option5.__value;
    			add_location(option5, file$6, 18, 2, 525);
    			option6.__value = "color-dodge";
    			option6.value = option6.__value;
    			add_location(option6, file$6, 19, 2, 573);
    			option7.__value = "overlay";
    			option7.value = option7.__value;
    			add_location(option7, file$6, 20, 2, 630);
    			option8.__value = "soft-light";
    			option8.value = option8.__value;
    			add_location(option8, file$6, 21, 2, 681);
    			option9.__value = "hard-light";
    			option9.value = option9.__value;
    			add_location(option9, file$6, 22, 2, 738);
    			option10.__value = "difference";
    			option10.value = option10.__value;
    			add_location(option10, file$6, 23, 2, 795);
    			option11.__value = "exclusion";
    			option11.value = option11.__value;
    			add_location(option11, file$6, 24, 2, 851);
    			option12.__value = "hue";
    			option12.value = option12.__value;
    			add_location(option12, file$6, 25, 2, 902);
    			option13.__value = "saturation";
    			option13.value = option13.__value;
    			add_location(option13, file$6, 26, 2, 941);
    			option14.__value = "color";
    			option14.value = option14.__value;
    			add_location(option14, file$6, 27, 2, 994);
    			option15.__value = "luminosity";
    			option15.value = option15.__value;
    			add_location(option15, file$6, 28, 2, 1038);
    			attr_dev(select, "class", "svelte-1osu7gw");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[2].call(select));
    			add_location(select, file$6, 12, 0, 221);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(select, option7);
    			append_dev(select, option8);
    			append_dev(select, option9);
    			append_dev(select, option10);
    			append_dev(select, option11);
    			append_dev(select, option12);
    			append_dev(select, option13);
    			append_dev(select, option14);
    			append_dev(select, option15);
    			select_option(select, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[2]),
    					listen_dev(select, "change", /*onChangeSelect*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				select_option(select, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectMixmode', slots, []);
    	let { value } = $$props;
    	const dispatch = createEventDispatcher();

    	const onChangeSelect = () => {
    		dispatch('value', { name: value });
    	};

    	const writable_props = ['value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectMixmode> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		value,
    		dispatch,
    		onChangeSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, onChangeSelect, select_change_handler];
    }

    class SelectMixmode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectMixmode",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<SelectMixmode> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<SelectMixmode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SelectMixmode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/component/InputColor.svelte generated by Svelte v3.43.1 */
    const file$5 = "src/component/InputColor.svelte";

    function create_fragment$5(ctx) {
    	let label;
    	let input;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(/*value*/ ctx[0]);
    			attr_dev(input, "type", "color");
    			attr_dev(input, "name", "bgcolor");
    			attr_dev(input, "class", "svelte-q1ocbv");
    			add_location(input, file$5, 13, 2, 244);
    			attr_dev(label, "for", "bgcolor");
    			attr_dev(label, "class", "svelte-q1ocbv");
    			add_location(label, file$5, 12, 0, 220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(label, t0);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(input, "change", /*onChangeInput*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (dirty & /*value*/ 1) set_data_dev(t1, /*value*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputColor', slots, []);
    	let { value } = $$props;
    	const dispatch = createEventDispatcher();

    	const onChangeInput = () => {
    		dispatch('value', { name: value });
    	};

    	const writable_props = ['value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputColor> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		value,
    		dispatch,
    		onChangeInput
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, onChangeInput, input_input_handler];
    }

    class InputColor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputColor",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<InputColor> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<InputColor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputColor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/component/FileReader.svelte generated by Svelte v3.43.1 */
    const file$4 = "src/component/FileReader.svelte";

    function create_fragment$4(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", "image/*");
    			attr_dev(input, "class", "svelte-1n6p6dj");
    			add_location(input, file$4, 20, 2, 456);
    			attr_dev(label, "for", "bgcolor");
    			attr_dev(label, "class", "svelte-1n6p6dj");
    			add_location(label, file$4, 19, 0, 432);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*onChangeInput*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileReader', slots, []);
    	let value;
    	const dispatch = createEventDispatcher();
    	const fileReader = new FileReader();

    	const onChangeInput = evt => {
    		const file = evt.target.files[0];
    		if (!file.type.match('image.*')) return;
    		fileReader.readAsDataURL(file);

    		fileReader.onload = () => {
    			dispatch('value', { src: fileReader.result });
    		};
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileReader> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		value,
    		dispatch,
    		fileReader,
    		onChangeInput
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) value = $$props.value;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onChangeInput];
    }

    class FileReader_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileReader_1",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/pages/BgBlendMode.svelte generated by Svelte v3.43.1 */
    const file$3 = "src/pages/BgBlendMode.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div7;
    	let div1;
    	let div0;
    	let div0_class_value;
    	let t2;
    	let div6;
    	let div2;
    	let h20;
    	let t4;
    	let selectmixmode;
    	let t5;
    	let div3;
    	let h21;
    	let t7;
    	let inputcolor;
    	let t8;
    	let div4;
    	let h22;
    	let t10;
    	let filereader;
    	let t11;
    	let div5;
    	let h23;
    	let t13;
    	let button;
    	let main_intro;
    	let main_outro;
    	let current;
    	let mounted;
    	let dispose;

    	selectmixmode = new SelectMixmode({
    			props: { value: /*mode*/ ctx[1] },
    			$$inline: true
    		});

    	selectmixmode.$on("value", /*handleChangeSelected*/ ctx[4]);

    	inputcolor = new InputColor({
    			props: { value: /*bgcolor*/ ctx[2] },
    			$$inline: true
    		});

    	inputcolor.$on("value", /*handleChangeInput*/ ctx[5]);
    	filereader = new FileReader_1({ $$inline: true });
    	filereader.$on("value", /*handleChangeBgImage*/ ctx[6]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "background blend mode sample";
    			t1 = space();
    			div7 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t2 = space();
    			div6 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "描画モード";
    			t4 = space();
    			create_component(selectmixmode.$$.fragment);
    			t5 = space();
    			div3 = element("div");
    			h21 = element("h2");
    			h21.textContent = "背景色";
    			t7 = space();
    			create_component(inputcolor.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			h22 = element("h2");
    			h22.textContent = "背景画像";
    			t10 = space();
    			create_component(filereader.$$.fragment);
    			t11 = space();
    			div5 = element("div");
    			h23 = element("h2");
    			h23.textContent = "アニメーション";
    			t13 = space();
    			button = element("button");
    			button.textContent = "フェードイン";
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$3, 27, 1, 742);
    			attr_dev(div0, "class", div0_class_value = "bg " + (/*animate*/ ctx[0] ? 'fadein' : 'hide') + " svelte-1kqho3i");
    			set_style(div0, "background-blend-mode", /*mode*/ ctx[1]);
    			set_style(div0, "background-color", /*bgcolor*/ ctx[2]);
    			set_style(div0, "background-image", "url(" + /*bgImg*/ ctx[3] + ")");
    			add_location(div0, file$3, 30, 3, 837);
    			attr_dev(div1, "class", "img svelte-1kqho3i");
    			add_location(div1, file$3, 29, 2, 816);
    			attr_dev(h20, "class", "row__title svelte-1kqho3i");
    			add_location(h20, file$3, 34, 4, 1049);
    			attr_dev(div2, "class", "row svelte-1kqho3i");
    			add_location(div2, file$3, 33, 3, 1027);
    			attr_dev(h21, "class", "row__title svelte-1kqho3i");
    			add_location(h21, file$3, 38, 4, 1185);
    			attr_dev(div3, "class", "row svelte-1kqho3i");
    			add_location(div3, file$3, 37, 3, 1163);
    			attr_dev(h22, "class", "row__title svelte-1kqho3i");
    			add_location(h22, file$3, 42, 4, 1316);
    			attr_dev(div4, "class", "row svelte-1kqho3i");
    			add_location(div4, file$3, 41, 3, 1294);
    			attr_dev(h23, "class", "row__title svelte-1kqho3i");
    			add_location(h23, file$3, 46, 4, 1434);
    			add_location(button, file$3, 47, 4, 1474);
    			attr_dev(div5, "class", "row svelte-1kqho3i");
    			add_location(div5, file$3, 45, 3, 1412);
    			attr_dev(div6, "class", "dashbord");
    			add_location(div6, file$3, 32, 2, 1001);
    			attr_dev(div7, "class", "wrap svelte-1kqho3i");
    			add_location(div7, file$3, 28, 1, 795);
    			add_location(main, file$3, 26, 0, 665);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div7);
    			append_dev(div7, div1);
    			append_dev(div1, div0);
    			append_dev(div7, t2);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t4);
    			mount_component(selectmixmode, div2, null);
    			append_dev(div6, t5);
    			append_dev(div6, div3);
    			append_dev(div3, h21);
    			append_dev(div3, t7);
    			mount_component(inputcolor, div3, null);
    			append_dev(div6, t8);
    			append_dev(div6, div4);
    			append_dev(div4, h22);
    			append_dev(div4, t10);
    			mount_component(filereader, div4, null);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, h23);
    			append_dev(div5, t13);
    			append_dev(div5, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleClickFadeIn*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*animate*/ 1 && div0_class_value !== (div0_class_value = "bg " + (/*animate*/ ctx[0] ? 'fadein' : 'hide') + " svelte-1kqho3i")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*mode*/ 2) {
    				set_style(div0, "background-blend-mode", /*mode*/ ctx[1]);
    			}

    			if (!current || dirty & /*bgcolor*/ 4) {
    				set_style(div0, "background-color", /*bgcolor*/ ctx[2]);
    			}

    			if (!current || dirty & /*bgImg*/ 8) {
    				set_style(div0, "background-image", "url(" + /*bgImg*/ ctx[3] + ")");
    			}

    			const selectmixmode_changes = {};
    			if (dirty & /*mode*/ 2) selectmixmode_changes.value = /*mode*/ ctx[1];
    			selectmixmode.$set(selectmixmode_changes);
    			const inputcolor_changes = {};
    			if (dirty & /*bgcolor*/ 4) inputcolor_changes.value = /*bgcolor*/ ctx[2];
    			inputcolor.$set(inputcolor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectmixmode.$$.fragment, local);
    			transition_in(inputcolor.$$.fragment, local);
    			transition_in(filereader.$$.fragment, local);

    			add_render_callback(() => {
    				if (main_outro) main_outro.end(1);
    				main_intro = create_in_transition(main, fade, { delay: 500, duration: 500 });
    				main_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectmixmode.$$.fragment, local);
    			transition_out(inputcolor.$$.fragment, local);
    			transition_out(filereader.$$.fragment, local);
    			if (main_intro) main_intro.invalidate();
    			main_outro = create_out_transition(main, fade, { duration: 500 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(selectmixmode);
    			destroy_component(inputcolor);
    			destroy_component(filereader);
    			if (detaching && main_outro) main_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BgBlendMode', slots, []);
    	let animate = true;
    	let mode = 'multiply';
    	let bgcolor = "#ff0000";
    	let bgImg = '/img/sample_img01.jpg';

    	const handleChangeSelected = evt => {
    		$$invalidate(1, mode = evt.detail.name);
    	};

    	const handleChangeInput = evt => {
    		$$invalidate(2, bgcolor = evt.detail.name);
    	};

    	const handleChangeBgImage = evt => {
    		$$invalidate(3, bgImg = evt.detail.src);
    	};

    	const handleClickFadeIn = () => {
    		$$invalidate(0, animate = false);

    		setTimeout(
    			() => {
    				$$invalidate(0, animate = true);
    			},
    			700
    		);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BgBlendMode> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		scale,
    		SelectMixmode,
    		InputColor,
    		FileReader: FileReader_1,
    		animate,
    		mode,
    		bgcolor,
    		bgImg,
    		handleChangeSelected,
    		handleChangeInput,
    		handleChangeBgImage,
    		handleClickFadeIn
    	});

    	$$self.$inject_state = $$props => {
    		if ('animate' in $$props) $$invalidate(0, animate = $$props.animate);
    		if ('mode' in $$props) $$invalidate(1, mode = $$props.mode);
    		if ('bgcolor' in $$props) $$invalidate(2, bgcolor = $$props.bgcolor);
    		if ('bgImg' in $$props) $$invalidate(3, bgImg = $$props.bgImg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		animate,
    		mode,
    		bgcolor,
    		bgImg,
    		handleChangeSelected,
    		handleChangeInput,
    		handleChangeBgImage,
    		handleClickFadeIn
    	];
    }

    class BgBlendMode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BgBlendMode",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/component/InputTxt.svelte generated by Svelte v3.43.1 */
    const file$2 = "src/component/InputTxt.svelte";

    function create_fragment$2(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "text");
    			attr_dev(input, "class", "svelte-q1ocbv");
    			add_location(input, file$2, 13, 2, 241);
    			attr_dev(label, "for", "text");
    			attr_dev(label, "class", "svelte-q1ocbv");
    			add_location(label, file$2, 12, 0, 220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(input, "change", /*onChangeInput*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputTxt', slots, []);
    	let { value } = $$props;
    	const dispatch = createEventDispatcher();

    	const onChangeInput = () => {
    		dispatch('value', { name: value });
    	};

    	const writable_props = ['value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputTxt> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		value,
    		dispatch,
    		onChangeInput
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, onChangeInput, input_input_handler];
    }

    class InputTxt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputTxt",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<InputTxt> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<InputTxt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputTxt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/MixBlendMode.svelte generated by Svelte v3.43.1 */
    const file$1 = "src/pages/MixBlendMode.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let div11;
    	let div1;
    	let div0;
    	let span;
    	let t2;
    	let span_class_value;
    	let t3;
    	let img;
    	let img_src_value;
    	let div0_class_value;
    	let t4;
    	let div10;
    	let div2;
    	let h20;
    	let t6;
    	let selectmixmode;
    	let t7;
    	let div3;
    	let h21;
    	let t9;
    	let inputcolor0;
    	let t10;
    	let div4;
    	let h22;
    	let t12;
    	let inputcolor1;
    	let t13;
    	let div5;
    	let h23;
    	let t15;
    	let inputtxt;
    	let t16;
    	let div6;
    	let h24;
    	let t18;
    	let inputcolor2;
    	let t19;
    	let div7;
    	let h25;
    	let t21;
    	let filereader;
    	let t22;
    	let div8;
    	let h26;
    	let t24;
    	let button0;
    	let t26;
    	let div9;
    	let h27;
    	let t28;
    	let button1;
    	let main_intro;
    	let main_outro;
    	let current;
    	let mounted;
    	let dispose;

    	selectmixmode = new SelectMixmode({
    			props: { value: /*mode*/ ctx[2] },
    			$$inline: true
    		});

    	selectmixmode.$on("value", /*handleChangeSelected*/ ctx[8]);

    	inputcolor0 = new InputColor({
    			props: { value: /*txtbgcolor*/ ctx[4] },
    			$$inline: true
    		});

    	inputcolor0.$on("value", /*handleChangeInputTxtBg*/ ctx[10]);

    	inputcolor1 = new InputColor({
    			props: { value: /*txtcolor*/ ctx[5] },
    			$$inline: true
    		});

    	inputcolor1.$on("value", /*handleChangeInputTxt*/ ctx[11]);

    	inputtxt = new InputTxt({
    			props: { value: /*sampleTxt*/ ctx[6] },
    			$$inline: true
    		});

    	inputtxt.$on("value", /*handleChangeTxt*/ ctx[12]);

    	inputcolor2 = new InputColor({
    			props: { value: /*bgcolor*/ ctx[3] },
    			$$inline: true
    		});

    	inputcolor2.$on("value", /*handleChangeInputBg*/ ctx[9]);
    	filereader = new FileReader_1({ $$inline: true });
    	filereader.$on("value", /*handleChangeBgImage*/ ctx[13]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "mix blend mode sample";
    			t1 = space();
    			div11 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t2 = text(/*sampleTxt*/ ctx[6]);
    			t3 = space();
    			img = element("img");
    			t4 = space();
    			div10 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "描画モード";
    			t6 = space();
    			create_component(selectmixmode.$$.fragment);
    			t7 = space();
    			div3 = element("div");
    			h21 = element("h2");
    			h21.textContent = "テキスト背景色";
    			t9 = space();
    			create_component(inputcolor0.$$.fragment);
    			t10 = space();
    			div4 = element("div");
    			h22 = element("h2");
    			h22.textContent = "テキスト色";
    			t12 = space();
    			create_component(inputcolor1.$$.fragment);
    			t13 = space();
    			div5 = element("div");
    			h23 = element("h2");
    			h23.textContent = "テキスト";
    			t15 = space();
    			create_component(inputtxt.$$.fragment);
    			t16 = space();
    			div6 = element("div");
    			h24 = element("h2");
    			h24.textContent = "背景色";
    			t18 = space();
    			create_component(inputcolor2.$$.fragment);
    			t19 = space();
    			div7 = element("div");
    			h25 = element("h2");
    			h25.textContent = "背景画像";
    			t21 = space();
    			create_component(filereader.$$.fragment);
    			t22 = space();
    			div8 = element("div");
    			h26 = element("h2");
    			h26.textContent = "全体アニメーション";
    			t24 = space();
    			button0 = element("button");
    			button0.textContent = "フェードイン";
    			t26 = space();
    			div9 = element("div");
    			h27 = element("h2");
    			h27.textContent = "文字だけアニメーション";
    			t28 = space();
    			button1 = element("button");
    			button1.textContent = "フェードイン";
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$1, 47, 1, 1239);
    			attr_dev(span, "class", span_class_value = "overtxt " + (/*animateTxt*/ ctx[1] ? 'fadein' : 'hide') + " svelte-12c1qho");
    			set_style(span, "color", /*txtcolor*/ ctx[5]);
    			set_style(span, "background-color", /*txtbgcolor*/ ctx[4]);
    			set_style(span, "mix-blend-mode", /*mode*/ ctx[2]);
    			add_location(span, file$1, 51, 4, 1418);
    			if (!src_url_equal(img.src, img_src_value = /*bgImg*/ ctx[7])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-12c1qho");
    			add_location(img, file$1, 52, 4, 1577);
    			attr_dev(div0, "class", div0_class_value = "inner " + (/*animate*/ ctx[0] ? 'fadein' : 'hide') + " svelte-12c1qho");
    			set_style(div0, "background-color", /*bgcolor*/ ctx[3]);
    			add_location(div0, file$1, 50, 3, 1327);
    			attr_dev(div1, "class", "img svelte-12c1qho");
    			add_location(div1, file$1, 49, 2, 1306);
    			attr_dev(h20, "class", "row__title svelte-12c1qho");
    			add_location(h20, file$1, 57, 4, 1673);
    			attr_dev(div2, "class", "row svelte-12c1qho");
    			add_location(div2, file$1, 56, 3, 1651);
    			attr_dev(h21, "class", "row__title svelte-12c1qho");
    			add_location(h21, file$1, 61, 4, 1809);
    			attr_dev(div3, "class", "row svelte-12c1qho");
    			add_location(div3, file$1, 60, 3, 1787);
    			attr_dev(h22, "class", "row__title svelte-12c1qho");
    			add_location(h22, file$1, 65, 4, 1952);
    			attr_dev(div4, "class", "row svelte-12c1qho");
    			add_location(div4, file$1, 64, 3, 1930);
    			add_location(h23, file$1, 69, 4, 2089);
    			attr_dev(div5, "class", "row svelte-12c1qho");
    			add_location(div5, file$1, 68, 3, 2067);
    			attr_dev(h24, "class", "row__title svelte-12c1qho");
    			add_location(h24, file$1, 73, 4, 2200);
    			attr_dev(div6, "class", "row svelte-12c1qho");
    			add_location(div6, file$1, 72, 3, 2178);
    			attr_dev(h25, "class", "row__title svelte-12c1qho");
    			add_location(h25, file$1, 77, 4, 2333);
    			attr_dev(div7, "class", "row svelte-12c1qho");
    			add_location(div7, file$1, 76, 3, 2311);
    			attr_dev(h26, "class", "row__title svelte-12c1qho");
    			add_location(h26, file$1, 81, 4, 2451);
    			add_location(button0, file$1, 82, 4, 2493);
    			attr_dev(div8, "class", "row svelte-12c1qho");
    			add_location(div8, file$1, 80, 3, 2429);
    			attr_dev(h27, "class", "row__title svelte-12c1qho");
    			add_location(h27, file$1, 85, 4, 2581);
    			add_location(button1, file$1, 86, 4, 2625);
    			attr_dev(div9, "class", "row svelte-12c1qho");
    			add_location(div9, file$1, 84, 3, 2559);
    			attr_dev(div10, "class", "dashbord");
    			add_location(div10, file$1, 55, 2, 1625);
    			attr_dev(div11, "class", "wrap svelte-12c1qho");
    			add_location(div11, file$1, 48, 1, 1285);
    			add_location(main, file$1, 46, 0, 1162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, div11);
    			append_dev(div11, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(div0, t3);
    			append_dev(div0, img);
    			append_dev(div11, t4);
    			append_dev(div11, div10);
    			append_dev(div10, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t6);
    			mount_component(selectmixmode, div2, null);
    			append_dev(div10, t7);
    			append_dev(div10, div3);
    			append_dev(div3, h21);
    			append_dev(div3, t9);
    			mount_component(inputcolor0, div3, null);
    			append_dev(div10, t10);
    			append_dev(div10, div4);
    			append_dev(div4, h22);
    			append_dev(div4, t12);
    			mount_component(inputcolor1, div4, null);
    			append_dev(div10, t13);
    			append_dev(div10, div5);
    			append_dev(div5, h23);
    			append_dev(div5, t15);
    			mount_component(inputtxt, div5, null);
    			append_dev(div10, t16);
    			append_dev(div10, div6);
    			append_dev(div6, h24);
    			append_dev(div6, t18);
    			mount_component(inputcolor2, div6, null);
    			append_dev(div10, t19);
    			append_dev(div10, div7);
    			append_dev(div7, h25);
    			append_dev(div7, t21);
    			mount_component(filereader, div7, null);
    			append_dev(div10, t22);
    			append_dev(div10, div8);
    			append_dev(div8, h26);
    			append_dev(div8, t24);
    			append_dev(div8, button0);
    			append_dev(div10, t26);
    			append_dev(div10, div9);
    			append_dev(div9, h27);
    			append_dev(div9, t28);
    			append_dev(div9, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleClickFadeIn*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*handleClickFadeInTxt*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*sampleTxt*/ 64) set_data_dev(t2, /*sampleTxt*/ ctx[6]);

    			if (!current || dirty & /*animateTxt*/ 2 && span_class_value !== (span_class_value = "overtxt " + (/*animateTxt*/ ctx[1] ? 'fadein' : 'hide') + " svelte-12c1qho")) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (!current || dirty & /*txtcolor*/ 32) {
    				set_style(span, "color", /*txtcolor*/ ctx[5]);
    			}

    			if (!current || dirty & /*txtbgcolor*/ 16) {
    				set_style(span, "background-color", /*txtbgcolor*/ ctx[4]);
    			}

    			if (!current || dirty & /*mode*/ 4) {
    				set_style(span, "mix-blend-mode", /*mode*/ ctx[2]);
    			}

    			if (!current || dirty & /*bgImg*/ 128 && !src_url_equal(img.src, img_src_value = /*bgImg*/ ctx[7])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*animate*/ 1 && div0_class_value !== (div0_class_value = "inner " + (/*animate*/ ctx[0] ? 'fadein' : 'hide') + " svelte-12c1qho")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*bgcolor*/ 8) {
    				set_style(div0, "background-color", /*bgcolor*/ ctx[3]);
    			}

    			const selectmixmode_changes = {};
    			if (dirty & /*mode*/ 4) selectmixmode_changes.value = /*mode*/ ctx[2];
    			selectmixmode.$set(selectmixmode_changes);
    			const inputcolor0_changes = {};
    			if (dirty & /*txtbgcolor*/ 16) inputcolor0_changes.value = /*txtbgcolor*/ ctx[4];
    			inputcolor0.$set(inputcolor0_changes);
    			const inputcolor1_changes = {};
    			if (dirty & /*txtcolor*/ 32) inputcolor1_changes.value = /*txtcolor*/ ctx[5];
    			inputcolor1.$set(inputcolor1_changes);
    			const inputtxt_changes = {};
    			if (dirty & /*sampleTxt*/ 64) inputtxt_changes.value = /*sampleTxt*/ ctx[6];
    			inputtxt.$set(inputtxt_changes);
    			const inputcolor2_changes = {};
    			if (dirty & /*bgcolor*/ 8) inputcolor2_changes.value = /*bgcolor*/ ctx[3];
    			inputcolor2.$set(inputcolor2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectmixmode.$$.fragment, local);
    			transition_in(inputcolor0.$$.fragment, local);
    			transition_in(inputcolor1.$$.fragment, local);
    			transition_in(inputtxt.$$.fragment, local);
    			transition_in(inputcolor2.$$.fragment, local);
    			transition_in(filereader.$$.fragment, local);

    			add_render_callback(() => {
    				if (main_outro) main_outro.end(1);
    				main_intro = create_in_transition(main, fade, { delay: 500, duration: 500 });
    				main_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectmixmode.$$.fragment, local);
    			transition_out(inputcolor0.$$.fragment, local);
    			transition_out(inputcolor1.$$.fragment, local);
    			transition_out(inputtxt.$$.fragment, local);
    			transition_out(inputcolor2.$$.fragment, local);
    			transition_out(filereader.$$.fragment, local);
    			if (main_intro) main_intro.invalidate();
    			main_outro = create_out_transition(main, fade, { duration: 500 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(selectmixmode);
    			destroy_component(inputcolor0);
    			destroy_component(inputcolor1);
    			destroy_component(inputtxt);
    			destroy_component(inputcolor2);
    			destroy_component(filereader);
    			if (detaching && main_outro) main_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MixBlendMode', slots, []);
    	let animate = true;
    	let animateTxt = true;
    	let mode = 'multiply';
    	let bgcolor = "#ffffff";
    	let txtbgcolor = "#ff0000";
    	let txtcolor = "#ffffff";
    	let sampleTxt = 'TEXTTEXTTEXT';
    	let bgImg = '/img/sample_img01.jpg';

    	const handleChangeSelected = evt => {
    		$$invalidate(2, mode = evt.detail.name);
    	};

    	const handleChangeInputBg = evt => {
    		$$invalidate(3, bgcolor = evt.detail.name);
    	};

    	const handleChangeInputTxtBg = evt => {
    		$$invalidate(4, txtbgcolor = evt.detail.name);
    	};

    	const handleChangeInputTxt = evt => {
    		$$invalidate(5, txtcolor = evt.detail.name);
    	};

    	const handleChangeTxt = evt => {
    		$$invalidate(6, sampleTxt = evt.detail.name);
    	};

    	const handleChangeBgImage = evt => {
    		$$invalidate(7, bgImg = evt.detail.src);
    	};

    	const handleClickFadeIn = () => {
    		$$invalidate(0, animate = false);

    		setTimeout(
    			() => {
    				$$invalidate(0, animate = true);
    			},
    			700
    		);
    	};

    	const handleClickFadeInTxt = () => {
    		$$invalidate(1, animateTxt = false);

    		setTimeout(
    			() => {
    				$$invalidate(1, animateTxt = true);
    			},
    			700
    		);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MixBlendMode> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		scale,
    		SelectMixmode,
    		InputColor,
    		FileReader: FileReader_1,
    		InputTxt,
    		animate,
    		animateTxt,
    		mode,
    		bgcolor,
    		txtbgcolor,
    		txtcolor,
    		sampleTxt,
    		bgImg,
    		handleChangeSelected,
    		handleChangeInputBg,
    		handleChangeInputTxtBg,
    		handleChangeInputTxt,
    		handleChangeTxt,
    		handleChangeBgImage,
    		handleClickFadeIn,
    		handleClickFadeInTxt
    	});

    	$$self.$inject_state = $$props => {
    		if ('animate' in $$props) $$invalidate(0, animate = $$props.animate);
    		if ('animateTxt' in $$props) $$invalidate(1, animateTxt = $$props.animateTxt);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('bgcolor' in $$props) $$invalidate(3, bgcolor = $$props.bgcolor);
    		if ('txtbgcolor' in $$props) $$invalidate(4, txtbgcolor = $$props.txtbgcolor);
    		if ('txtcolor' in $$props) $$invalidate(5, txtcolor = $$props.txtcolor);
    		if ('sampleTxt' in $$props) $$invalidate(6, sampleTxt = $$props.sampleTxt);
    		if ('bgImg' in $$props) $$invalidate(7, bgImg = $$props.bgImg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		animate,
    		animateTxt,
    		mode,
    		bgcolor,
    		txtbgcolor,
    		txtcolor,
    		sampleTxt,
    		bgImg,
    		handleChangeSelected,
    		handleChangeInputBg,
    		handleChangeInputTxtBg,
    		handleChangeInputTxt,
    		handleChangeTxt,
    		handleChangeBgImage,
    		handleClickFadeIn,
    		handleClickFadeInTxt
    	];
    }

    class MixBlendMode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MixBlendMode",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.43.1 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let a0;
    	let t0;
    	let a0_data_current_value;
    	let t1;
    	let a1;
    	let t2;
    	let a1_data_current_value;
    	let t3;
    	let router;
    	let current;
    	let mounted;
    	let dispose;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			t0 = text("mix-blend-mode sample");
    			t1 = space();
    			a1 = element("a");
    			t2 = text("background-blend-mode sample");
    			t3 = space();
    			create_component(router.$$.fragment);
    			attr_dev(a0, "data-current", a0_data_current_value = /*$location*/ ctx[0] === '/' ? 'true' : 'false');
    			attr_dev(a0, "class", "svelte-1p7yv5h");
    			add_location(a0, file, 15, 4, 360);
    			attr_dev(a1, "data-current", a1_data_current_value = /*$location*/ ctx[0] === '/bg/' ? 'true' : 'false');
    			attr_dev(a1, "class", "svelte-1p7yv5h");
    			add_location(a1, file, 17, 4, 533);
    			attr_dev(div0, "class", "nav svelte-1p7yv5h");
    			add_location(div0, file, 13, 2, 288);
    			attr_dev(div1, "class", "wrap");
    			add_location(div1, file, 12, 0, 267);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(a1, t2);
    			append_dev(div1, t3);
    			mount_component(router, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0, { href: '/', disabled: false })),
    					action_destroyer(link.call(null, a1, { href: '/bg/', disabled: false }))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$location*/ 1 && a0_data_current_value !== (a0_data_current_value = /*$location*/ ctx[0] === '/' ? 'true' : 'false')) {
    				attr_dev(a0, "data-current", a0_data_current_value);
    			}

    			if (!current || dirty & /*$location*/ 1 && a1_data_current_value !== (a1_data_current_value = /*$location*/ ctx[0] === '/bg/' ? 'true' : 'false')) {
    				attr_dev(a1, "data-current", a1_data_current_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(router);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, 'location');
    	component_subscribe($$self, location, $$value => $$invalidate(0, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const routes = { '/': MixBlendMode, '/bg/': BgBlendMode };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		link,
    		location,
    		BgBlendMode,
    		MixBlendMode,
    		routes,
    		$location
    	});

    	return [$location, routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.getElementById('app'),
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
