# Welcome to your Expo app 👋

The plan is a local api that is updateable for the sake of scheduling.
Some aspects will be hardcoded and unchangeable in the interface. These will be the pet options, the pricing, and the two users (sitter and owner because this isn't a production app, and I'd like to take advantage of my freedom and break out of the boring conventions of client and admin)
The following is my process in order

1. Building a simple login page. Just a text field and a button.
2. Build simple api so login accomplishes something. Consulted ChatGPT for the best way to set up a functional, local api.
3. build and navigate to the owner view. Used Copilot for the cross app user information to save time. Set up the ability to fetch and submit bookings attached to the current user. Initially tried a date picker with two calenders for a start and end date, went down a long, unnecessary road. Settled on a much simpler solution. Used AI to clean up all the crap that I'd put in trying to get the calendar to work right. Things are much better now. The simpler idea was not AI's however. I merely used it to save myself at least and hour since I'd already wasted 2 on a bad idea.
4. Fetch and display user's bookings.
5. Owner page. I want it to list the bookings in a schedule format. Will use AI to generate a bunch of potential bookings just to give more datea to work with. AI was used for the date logic because that just gets confusing.
6. Need to make everything pretty but first, Expo build creates a lot of files that I'm not using. So I'm going to tell AI to get rid of all of them.
7. I'm going to go through and simplifying the code.
8. Time to make the log in view presentable
9. Now for the Owner view
