let today = moment();
let currentDate = moment().date(1);
let calendar;
const colors = ["orange", "yellow", "blue", "green"];

function myCalendar() {
   class Calendar {
	   constructor(selector, events) {
		   this.el = document.querySelector(selector);
		   this.events = events;
		   this.current = currentDate;
		   this.draw();
		   var current = document.querySelector(".today");
		   if (current) {
			   var self = this;
			   window.setTimeout(function () {
				   self.openDay(current);
			   }, 500);
		   }
	   }
	   draw() {
		   //Create Header
		   this.drawHeader();
		   //Draw Month
		   this.drawMonth();
	   }
	   drawHeader() {
		   var self = this;
		   if (!this.header) {
			   //Create the header elements
			   this.header = createElement("div", "header");
			   this.header.className = "header";
			   this.title = createElement("h1");
			   var right = createElement("div", "right");
			   right.addEventListener("click", function () {
				   self.nextMonth();
			   });
			   var left = createElement("div", "left");
			   left.addEventListener("click", function () {
				   self.prevMonth();
			   });
			   //Append the Elements
			   this.header.appendChild(this.title);
			   this.header.appendChild(right);
			   this.header.appendChild(left);
			   this.el.appendChild(this.header);
		   }
		   this.title.innerHTML = this.current.format("MMMM YYYY");
	   }
	   drawMonth() {
		   var self = this;
		   this.events.forEach(function (ev) {
			   ev.date = moment(`${ev.birthday}`, "YYYY-MM-DD");
		   });
		   if (this.month) {
			   this.oldMonth = this.month;
			   this.oldMonth.className = "month out " + (self.next ? "next" : "prev");
			   this.oldMonth.addEventListener("webkitAnimationEnd", function () {
				if (self.oldMonth.parentNode){
				self.oldMonth.parentNode.removeChild(self.oldMonth);

				   self.month = createElement("div", "month");
				   self.backFill();
				   self.currentMonth();
				   self.fowardFill();
				   self.el.appendChild(self.month);
				   window.setTimeout(function () {
					   self.month.className = "month in " + (self.next ? "next" : "prev");
				   }, 16);
				};
				});
		   }
		   else {
			   this.month = createElement("div", "month");
			   this.el.appendChild(this.month);
			   this.backFill();
			   this.currentMonth();
			   this.fowardFill();
			   this.month.className = "month new";
		   }
	   }
	   backFill() {
		   var clone = this.current.clone();
		   var dayOfWeek = clone.day();
		   if (!dayOfWeek) {
			   return;
		   }
		   clone.subtract("days", dayOfWeek + 1);
		   for (var i = dayOfWeek; i > 0; i--) {
			   this.drawDay(clone.add("days", 1));
		   }
	   }
	   fowardFill() {
		   var clone = this.current
			   .clone()
			   .add("months", 1)
			   .subtract("days", 1);
		   var dayOfWeek = clone.day();
		   if (dayOfWeek === 6) {
			   return;
		   }
		   for (var i = dayOfWeek; i < 6; i++) {
			   this.drawDay(clone.add("days", 1));
		   }
	   }
	   currentMonth() {
		   var clone = this.current.clone();
		   while (clone.month() === this.current.month()) {
			   this.drawDay(clone);
			   clone.add("days", 1);
		   }
	   }
	   getWeek(day) {
		   if (!this.week || day.day() === 0) {
			   this.week = createElement("div", "week");
			   this.month.appendChild(this.week);
		   }
	   }
	   drawDay(day) {
		   var self = this;
		   this.getWeek(day);
		   //Outer Day
		   var outer = createElement("div", this.getDayClass(day));
		   outer.addEventListener("click", function () {
			   self.openDay(this);
		   });
		   //Day Name
		   var name = createElement("div", "day-name", day.format("ddd"));
		   //Day Number
		   var number = createElement("div", "day-number", day.format("DD"));
		   //Events
		   var events = createElement("div", "day-events");
		   this.drawEvents(day, events);
		   outer.appendChild(name);
		   outer.appendChild(number);
		   outer.appendChild(events);
		   this.week.appendChild(outer);
	   }
	   drawEvents(day, element) {
		   if (day.month() === this.current.month()) {
			   var todaysEvents = this.events.reduce(function (memo, ev) {
				   if (ev.date.month() === day.month() && ev.date.date() === day.date()) {
					   memo.push(ev);
				   }
				   return memo;
			   }, []);
			   todaysEvents.forEach(function (ev) {
				   var evSpan = createElement("span", ev.color);
				   element.appendChild(evSpan);
			   });
		   }
	   }
	   getDayClass(day) {
		  let classes = ["day"];
		   if (day.month() !== this.current.month()) {
			   classes.push("other");
		   }
		   else if (today.isSame(day, "day")) {
			   classes.push("today");
		   }
		   return classes.join(" ");
	   }
	   openDay(el) {
		   var details, arrow;
		   var dayNumber = +el.querySelectorAll(".day-number")[0].innerText ||
			   +el.querySelectorAll(".day-number")[0].textContent;
		   var day = this.current.clone().date(dayNumber);
		   var currentOpened = document.querySelector(".details");
		   //Check to see if there is an open detais box on the current row
		   if (currentOpened && currentOpened.parentNode === el.parentNode) {
			   details = currentOpened;
			   arrow = document.querySelector(".arrow");
		   }
		   else {
			   //Close the open events on differnt week row
			   //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
			   if (currentOpened) {
				   currentOpened.addEventListener("webkitAnimationEnd", function () {
					   currentOpened.parentNode.removeChild(currentOpened);
				   });
				   currentOpened.addEventListener("oanimationend", function () {
					   currentOpened.parentNode.removeChild(currentOpened);
				   });
				   currentOpened.addEventListener("msAnimationEnd", function () {
					   currentOpened.parentNode.removeChild(currentOpened);
				   });
				   currentOpened.addEventListener("animationend", function () {
					   currentOpened.parentNode.removeChild(currentOpened);
				   });
				   currentOpened.className = "details out";
			   }
			   //Create the Details Container
			   details = createElement("div", "details in");
			   //Create the arrow
				arrow = createElement("div", "arrow");
			   //Create the event wrapper
			   details.appendChild(arrow);
			   el.parentNode.appendChild(details);
		   }
		   var todaysEvents = this.events.reduce(function (memo, ev) {
			   if (ev.date.month() === day.month() && ev.date.date() === day.date()) {
				   memo.push(ev);
			   }
			   return memo;
		   }, []);
		   this.renderEvents(todaysEvents, details);
		   arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + "px";
	   }
	   renderEvents(events, ele) {
		   //Remove any events in the current details element
		   var currentWrapper = ele.querySelector(".events");
		   var wrapper = createElement("div", "events in" + (currentWrapper ? " new" : ""));
		   events.forEach(function (ev) {
			   var div = createElement("div", "event");
			   var square = createElement("div", "event-category " + ev.color);
			   var span = createElement("span", "", ev.eventName);
			   var deleteBirthday = createElement("button", "delete-btn", "X");
			   div.appendChild(square);
			   div.appendChild(span);
			   div.appendChild(deleteBirthday);
			   wrapper.appendChild(div);
			   deleteBirthday.onclick = deleteData;
		   });
		   if (!events.length) {
			   var div = createElement("div", "event empty");
			   var span = createElement("span", "", "No Birthdays");
			   div.appendChild(span);
			   wrapper.appendChild(div);
		   }
		   if (currentWrapper) {
			   currentWrapper.className = "events out";
			   currentWrapper.addEventListener("webkitAnimationEnd", function () {
				   currentWrapper.parentNode.removeChild(currentWrapper);
				   ele.appendChild(wrapper);
			   });
			   currentWrapper.addEventListener("oAnimationend", function () {
				   currentWrapper.parentNode.removeChild(currentWrapper);
				   ele.appendChild(wrapper);
			   });
			   currentWrapper.addEventListener("msAnimationEnd", function () {
				   currentWrapper.parentNode.removeChild(currentWrapper);
				   ele.appendChild(wrapper);
			   });
			   currentWrapper.addEventListener("animationend", function () {
				   currentWrapper.parentNode.removeChild(currentWrapper);
				   ele.appendChild(wrapper);
			   });
		   }
		   else {
			   ele.appendChild(wrapper);
		   }
	   }
	   nextMonth() {
		   this.current.add("months", 1);
		   this.next = true;
		   this.draw();
	   }
	   prevMonth() {
		   this.current.subtract("months", 1);
		   this.next = false;
		   this.draw();
	   }
   }
   window.Calendar = Calendar;

   function createElement(tagName, className, innerText) {
	   var ele = document.createElement(tagName);
	   if (className) {
		   ele.className = className;
	   }
	   if (innerText) {
		   ele.innderText = ele.textContent = innerText;
	   }
	   return ele;
   }
}

const myData = [
	{
		name: "John Doe",
		birthday: "1998-04-18"
	},
	{
		name: "Mary Jane",
		birthday: "2012-06-10"
	},
	{
		name: "Thomas Hill",
		birthday: "1969-09-17"
	},
	{
		name: "Adolf House",
		birthday: "1966-10-30"
	},
	{
		name: "Gweneviere Barkling",
		birthday: "1990-01-25"
	},
	{
		name: "Nicolas Thomas",
		birthday: "2016-03-28"
	},
	{
		name: "Brad Trevor",
		birthday: "1999-11-07"
	},
	{
		name: "Mary Dickson",
		birthday: "2009-12-21"
	},
	{
		name: "Erica Jones",
		birthday: "1989-01-07"
	},
	{
		name: "Justin Barr",
		birthday: "2009-02-24"
	},
	{
		name: "Mariam Wells",
		birthday: "2009-08-24"
	},
]

const dataObjects = [];
myData.map(birthday => {
	let dataObject = {
		eventName: birthday.name,
		birthday: birthday.birthday,
		color: colors[Math.floor(Math.random() * 4)]
	};
 return dataObjects.push(dataObject);
});
const data = dataObjects;

function showCalendar() {
   myCalendar();
   calendar = new window.Calendar("#calendar", data);
}
showCalendar();

const viewDate = document.getElementById("viewDate");
const addEvent = document.getElementById("addEvent");

viewDate.onsubmit = showDate;
addEvent.onsubmit = addBirthday;

function showDate(e) {
   e.preventDefault();
   document.getElementById("calendar").innerHTML = "";
   let form = new FormData(viewDate);
   let newDate = form.get("my-date");
   today = moment(`${newDate}`, "YYYY-MM-DD", true);
   currentDate = moment(`${newDate}`, "YYYY-MM").date(1);
   myCalendar();
   calendar = new window.Calendar("#calendar", data);
   viewDate.reset();
}

function addBirthday(e) {
   const loading = document.querySelector(".loading");
   const failed = document.querySelector(".failed");
   const success = document.querySelector(".success");
   e.preventDefault();
   loading.style.display = "flex";
   failed.style.display = "none";
   success.style.display = "none";
   document.getElementById("calendar").innerHTML = "";
   let form = new FormData(addEvent);
   let formDate = form.get("my-date");
   let birthdayName = form.get("name");

   const Params = {
	headers: {
		"Content-type": "application/JSON",
	},
	body: JSON.stringify({
		name: birthdayName,
		birthday: formDate,
	}),
	method: "POST",
};

async function addBirthday() {
/*	const res = await fetch(
		"http://localhost:3000/add/pg/birthday",
		Params
	);
	const data = await res.json();
	if (data.success) {                   */
		addCalendarEvent();
		loading.style.display = "none";
		failed.style.display = "none";
		success.style.display = "flex";
		success.firstChild.innerHTML = "added successfully";
		window.setTimeout(function () {
			success.style.display = "none";
		}, 3000);
//	};
}
addBirthday().catch(err =>{
	console.log(err);
	loading.style.display = "none";
	failed.style.display = "flex";
	success.style.display = "none";
	failed.firstChild.innerHTML = err;
	window.setTimeout(function () {
		failed.style.display = "none";
	}, 3000);
});

function addCalendarEvent() {
   let newEvent = {
		eventName: birthdayName,
		birthday: formDate,
		color: colors[Math.floor(Math.random() * 4)]
	};
   data.push(newEvent);
   today = moment(`${formDate}`, "YYYY-MM-DD", true);
   currentDate = moment(`${formDate}`, "YYYY-MM").date(1);
   myCalendar();
   calendar = new window.Calendar("#calendar", data);
   addEvent.reset();
   showBirthdayTable();
 };
};

function deleteData(e){
const failed = document.querySelector(".delete-failed");
const success = document.querySelector(".delete-success");
   const confirimation = window.confirm('Delete Birthday?');
   if (confirimation){
	   const dataName = e.target.previousSibling.innerHTML;
	   const birthday = data.find(x => x.eventName === dataName);

	   const name = birthday.eventName;
	   const birthdayDate = birthday.birthday;

	   const Params = {
		headers: {
			"Content-type": "application/JSON",
		},
		body: JSON.stringify({
			name: name,
			birthday: birthdayDate,
		}),
		method: "POST",
	};

	async function delBirthday() {
	/*	const res = await fetch(
			"http://localhost:3000/delete/pg/birthday",
			Params
		);
		const data = await res.json();
	//	if (data.success) {                         */
			deleteCalendarBirthday();
			failed.style.display = "none";
			success.style.display = "flex";
			success.firstChild.innerHTML = "deleted successfully";
			window.setTimeout(function () {
			success.style.display = "none";
		}, 3000);
	//	};
	};
	delBirthday().catch(err =>{
		console.log(err);
		failed.style.display = "flex";
		success.style.display = "none";
		window.setTimeout(function () {
			failed.style.display = "none";
		}, 3000);
	});

	function deleteCalendarBirthday(){
	   const i = data.indexOf(birthday);
	   data.splice(i, 1);
	   document.getElementById("calendar").innerHTML = "";
		myCalendar();
		calendar = new window.Calendar("#calendar", data);
		showBirthdayTable();
	 };
   };
};

function showBirthdayTable(){
	const nameArray = [];
	const sortedDataArray = [];
	data.map(d =>
		nameArray.push(d.eventName.toLowerCase())
	);
	nameArray.sort();
	nameArray.map(name =>{
		data.map(birthday => {
			const birthname = birthday.eventName.toLowerCase();
			if (name === birthname) {
			   let sortedData = {
				   name: birthday.eventName,
				   birthday: birthday.birthday
			   };
			   sortedDataArray.push(sortedData);
			};
		});
	});
	const table = document.getElementById("table");
	table.innerHTML = "";

	const dataText = `
			<table>
			<colgroup span="3"></colgroup>
				<thead>
					<tr>
					  <th>S/N</th>
					  <th colSpan="4">Names (a-z)</th>
					  <th>Birthdays(YYYY-MM-DD)</th>
					</tr>
				</thead>
				<tbody id="tableData"></tbody>
			</table>
			`;
		table.innerHTML = dataText;
	sortedDataArray.map(data => {
		const dataDiv = `
			<tr key=${Math.random()}>
				<td>${sortedDataArray.indexOf(data) + 1}</td>
				<td colspan="4">${data.name}</td>
				<td>${data.birthday}</td>
			</tr>
		`;
	   const tableDiv = document.getElementById("tableData");
	   return tableDiv.insertAdjacentHTML("beforeend", dataDiv);
	});
};
showBirthdayTable();