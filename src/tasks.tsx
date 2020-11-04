import app, { Component } from 'apprun';


type Task = {
    id: number;
    text: string;
    owner: number;
    status: 'open' | 'in-progress' | 'complete';
    editing: true | false;
    oldText?: string;
    cursorPosition?: number;

  }

  const STORAGE_KEY: string = 'to-do-list-'



export default class TaskComponent extends Component
{
    state = {
        tasks: [],
        value: '',
        type: 'my',
        title: 'My Todos',
        storageKey: `${STORAGE_KEY}-my`
    }

    view = (state) => <div>
    <h1>Kanban | Task Page</h1> 
    <h2 class="tasktitles">Project Title</h2>
    <section>
        <h2 class="tasktitles">{state.title}</h2>
    </section>
    <ul class="nav nav-pills mb-3 nav-justified mobileOnly" id="pills-tab" role="tablist">
        <li class="nav-item">
        <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-todo" role="tab" aria-controls="pills-home" aria-selected="true">Todo</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-doing" role="tab" aria-controls="pills-profile" aria-selected="false">Doing</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-done" role="tab" aria-controls="pills-contact" aria-selected="false">Done</a>
        </li>
    </ul>
        <div class="tab-content mobileOnly" id="pills-tabContent">
            <div class="tab-pane fade show active" id="pills-todo" role="tabpanel" aria-labelledby="pills-home-tab">
            <section id="todoZone">
            {state.tasks.filter(task => task.status==='open').length>0 ? 
            <ul class="tasklist">
                {state.tasks.filter(task=>task.status==='open').map(task=>(
               ( <li key={task} id={task.id} draggable="true" ondragstart={e => this.run('onDragStart', e)}>
               <span contenteditable={task.editing} 
                     onclick={(e)=>this.run("toggleEditable", task.id, e)}
                     onkeyup={(e)=>this.run("updateTask", task.id, e )}>{task.text}</span> &nbsp;
               {task.status === "open" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDoing', task.id)}>Doing</button>
                   : task.status === "in-progress" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDone', task.id)}>Done</button>
                   : task.status === "complete" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('deleteTask', task.id)}>Delete</button>
                   : <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDoing', task.id)}>Doing</button>
               }
           </li> )
                ))}
            </ul>
        : <div>No tasks!</div>
        }

            </section>
            <form class="col align-self-center pull-bottom desktopOnly"id="newTask"onsubmit={e => this.run('addTask', e)}>
                    <input name="text" type="text" placeholder="Add a task" required/>
                    <button class="btn btn-dark pull-right btn-sm">Add</button>
                </form>
            </div>
            <div class="tab-pane fade" id="pills-doing" role="tabpanel" aria-labelledby="pills-profile-tab">
                <section id='doingZone' style='border: solid orange 1px' ondragover="event.preventDefault()" ondrop={e => this.run('onDropDoing', e)}>
                {state.tasks.filter(task => task.status==='in-progress').length>0 ? 
            <ul class="tasklist">
                {state.tasks.filter(task=>task.status==='in-progress').map(task=>(
               ( <li key={task} id={task.id} draggable="true" ondragstart={e => this.run('onDragStart', e)}>
               <span contenteditable={task.editing} 
                     onclick={(e)=>this.run("toggleEditable", task.id, e)}
                     onkeyup={(e)=>this.run("updateTask", task.id, e )}>{task.text}</span> &nbsp;
               {task.status === "open" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDoing', task.id)}>Doing</button>
                   : task.status === "in-progress" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDone', task.id)}>Done</button>
                   : task.status === "complete pull-right btn-sm" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('deleteTask', task.id)}>Delete</button>
                   : <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDoing', task.id)}>Doing</button>
               }
           </li> )
                ))}
            </ul>
        : <div>No doing tasks!</div>
        }
                </section>

            </div>
            <div class="tab-pane fade" id="pills-done" role="tabpanel" aria-labelledby="pills-contact-tab">
                <section id='doneZone' class="mobileOnly" ondragover="event.preventDefault()" ondrop={e => this.run('onDropDone', e)}>
                {state.tasks.filter((task: Task) => task.status==='complete').length>0 ? 
            <ul class="tasklist">
                {state.tasks.filter((task:Task)=>task.status==='complete').map((task: Task)=>(
               ( <li key={task} id={task.id} draggable="true" ondragstart={e => this.run('onDragStart', e)}>
               <span contenteditable={task.editing} 
                     onclick={(e)=>this.run("toggleEditable", task.id, e)}
                     onkeyup={(e)=>this.run("updateTask", task.id, e )}>{task.text}</span> &nbsp;
               {task.status === "open" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDoing', task.id)}>Doing</button>
                   : task.status === "in-progress" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDone', task.id)}>Done</button>
                   : task.status === "complete" ?
                   <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('deleteTask', task.id)}>Delete</button>
                   : <button class="btn btn-dark pull-right btn-sm" onclick={ () => this.run('markDoing', task.id)}>Doing</button>
               }
           </li> )
                ))}
            </ul>
        : <div>No done tasks!</div>
        }
                </section>
            </div>
        </div>
   



    <div class="desktopContent">
    <section id="todoZone" class="desktopOnly" ondragover="event.preventDefault()" ondrop={e => this.run('onDropTodo', e)}>
        {state.tasks.filter(task => task.status==='open').length>0 ? 
        <ul class="tasklist">
            {state.tasks.filter(task=>task.status==='open').map(task=>(
            ( <li key={task} id={task.id} draggable="true" ondragstart={e => this.run('onDragStart', e)}>
                <span contenteditable={task.editing} 
                     onclick={(e)=>this.run("toggleEditable", task.id, e)}
                     onkeyup={(e)=>this.run("updateTask", task.id, e )}>{task.text}
                </span> &nbsp;
           </li> )
                ))}
        </ul>
        : <div>No tasks!</div>
        }
    </section>

    <section id='doingZone' class="desktopOnly" ondragover="event.preventDefault()" ondrop={e => this.run('onDropDoing', e)}>
        {state.tasks.filter(task => task.status==='in-progress').length>0 ? 
        <ul class="tasklist">
            {state.tasks.filter(task=>task.status==='in-progress').map(task=>(
            ( <li key={task} id={task.id} draggable="true" ondragstart={e => this.run('onDragStart', e)}>
                <span contenteditable={task.editing} 
                     onclick={(e)=>this.run("toggleEditable", task.id, e)}
                     onkeyup={(e)=>this.run("updateTask", task.id, e )}>{task.text}
                </span> &nbsp;
           </li> )
                ))}
        </ul>
        : <div>No doing tasks!</div>
        }
    </section>

    <section id='doneZone' class="desktopOnly" ondragover="event.preventDefault()" ondrop={e => this.run('onDropDone', e)}>
        {state.tasks.filter((task: Task) => task.status==='complete').length>0 ? 
        <ul class="tasklist">
        {state.tasks.filter((task:Task)=>task.status==='complete').map((task: Task)=>(
        ( <li key={task} id={task.id} draggable="true" ondragstart={e => this.run('onDragStart', e)}>
            <span contenteditable={task.editing} 
                onclick={(e)=>this.run("toggleEditable", task.id, e)}
                onkeyup={(e)=>this.run("updateTask", task.id, e )}>{task.text}
            </span> &nbsp;
        </li> )
         ))}
        </ul>
        : <div>No done tasks!</div>
        }
        </section>
        
    </div>

    <form class="col align-self-center pull-bottom"id="newTask"onsubmit={e => this.run('addTask', e)} style="margin-top: 15px;">
                    <input name="text" type="text" placeholder="Add a task" required/>
                    <button class="btn btn-dark pull-right btn-sm">Add</button>
                </form>

    <section id='deleteZone' ondragover="event.preventDefault()" ondrop={e => this.run('onDropDelete', e)}>
        <svg width="2.5em" height="2.5em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
    </section>
    </div>;

    update = {
        addTask: async (state, event) => {
            event.preventDefault()
            const data = new FormData(event.target)
            const task:Task = {
                id: state.tasks.length + 1,
                owner: 0,
                text: data.get("text").toString(),
                status: "open",
                editing: false
            }
            event.target.text.value = ""
            return {...state, tasks: [...state.tasks, task]}
        },
        markDoing: async (state, id) => {
            const tasks = state.tasks.map((task) => {
                if(task.id === id) {
                    return {
                        ...task,
                        status: "in-progress"
                    }
                }
                return task
            })
            return {...state, tasks}
        },
        markDone: async (state, id) => {
            const tasks = state.tasks.map((task) => {
                if(task.id === id) {
                    return {
                        ...task,
                        status: "complete"
                    }
                }
                return task
            })
            return {...state, tasks}
        },
        deleteTask: async (state, id) => {
            return {
                ...state,
                tasks: [...state.tasks.filter((task) => task.id !== id)]
            }
        },
        toggleEditable: async (state, id, event) => {
            const cursorPosition = EditCaretPositioning.saveSelection(event.currentTarget);
            if(state.tasks.find(task => task.id===id).editing===false){
                return {...state, tasks: [...state.tasks.map( (task) => task.id === id ?
                    ({...task, editing: !task.editing, oldText: task.text, cursorPosition})
                    :
                    (task)
                )]}
            } else {
                return {...state, tasks: [...state.tasks.map( (task) => task.id === id ?
                    ({...task, editing: !task.editing, oldText: "", cursorPosition: null})
                    :
                    (task)
                )]}
            }
        },
        updateTask: async (state, id, event) => {
            const savedCaretPosition = EditCaretPositioning.saveSelection(event.currentTarget)
            if(event.key==="Escape"){
                /* need to add ability to cancel editing*/
                return {...state,
                  tasks: [...state.tasks.map(task => task.id===id
                    ? ({...task, text: task.oldText, oldText: "", editing: false })
                    : (task) 
                )]}
            } else if (event.key==='Enter'){
                return {...state, 
                  tasks: [...state.tasks.map(task => task.id===id
                    ? ({...task, oldText: "", editing: false})
                    : (task)
                )]}
            } else {
                return {...state,
                  tasks: [...state.tasks.map(task => task.id===id
                    ? ({...task, text: event.currentTarget.textContent, cursorPosition: savedCaretPosition})
                    : (task)
                  )]};
            }
        },
        onDragStart: async (state, event) => {
            event.dataTransfer.setData('id', event.target.id)
            event.dataTransfer.setData('status', event.target.status)
            return {...state}
        },
        onDropDelete: async (state, event) => {
            event.preventDefault()
            const id = event.dataTransfer.getData('id')
            const index = state.tasks.findIndex(task => task.id == id)
            state.tasks.splice(index, 1)
            return {... state}
        },
        onDropDoing: async (state, event) => {
            event.preventDefault()
            const id = event.dataTransfer.getData('id')
            const tasks = state.tasks.map((task) => {
                if(task.id == id) {
                    return {
                        ...task,
                        status: "in-progress"
                    }
                }
                return task                
            })
            return {... state, tasks}
        },
        onDropDone: async (state, event) => {
            event.preventDefault()
            const id = event.dataTransfer.getData('id')
            const tasks = state.tasks.map((task) => {
                if(task.id == id) {
                    return {
                        ...task,
                        status: "complete"
                    }
                }
                return task
            })
            return {...state, tasks}
        },
        onDropTodo: async (state, event) => {
            event.preventDefault()
            const id = event.dataTransfer.getData('id')
            const tasks = state.tasks.map((task) => {
                if(task.id == id) {
                    return {
                        ...task,
                        status: "open"
                    }
                }
                return task
            })
            return {...state, tasks}
        }
    }
    //this will make it easy to have multiple task components on a givenpage. Allow us to identify, tag and title. Will make easier to connect to the project page.
    constructor(props) {
        super()
        const storageKey:string = `${STORAGE_KEY}${props['type']}`
        const stored:string = localStorage.getItem(storageKey)
        this.state = stored ? JSON.parse(stored) : {...this.state, ...props, storageKey}
    }
    rendered = (state) => localStorage.setItem(this.state.storageKey, JSON.stringify(state))
}
const EditCaretPositioning =( ()=>{
    let saveSelection:Function, restoreSelection: Function;

    
        //saves caret position(s)
        saveSelection = function(containerEl) {
            var range = window.getSelection().getRangeAt(0);
            var preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(containerEl);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            var start = preSelectionRange.toString().length;
    
            return {
                start: start,
                end: start + range.toString().length
            }
        };
        //restores caret position(s) this was a library!!!!
        restoreSelection = function(containerEl, savedSel) {
            var charIndex = 0, range = document.createRange();
            range.setStart(containerEl, 0);
            range.collapse(true);
            var nodeStack = [containerEl], node, foundStart = false, stop = false;
    
            while (!stop && (node = nodeStack.pop())) {
                if (node.nodeType === 3) {
                    var nextCharIndex = charIndex + node.length;
                    if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                        range.setStart(node, savedSel.start - charIndex);
                        foundStart = true;
                    }
                    if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                        range.setEnd(node, savedSel.end - charIndex);
                        stop = true;
                    }
                    charIndex = nextCharIndex;
                } else {
                    var i = node.childNodes.length;
                    while (i--) {
                        nodeStack.push(node.childNodes[i]);
                    }
                }
            }
    
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    return { saveSelection, restoreSelection}
})()