document.addEventListener("DOMContentLoaded", function () {
    const pages = {
        index: {
            title: "Home",
            content: `
                <h1 align="center">
                    Welcome to my awesome site.
                    Here you can find out about me, Felix, my passion projects, what I do,
                    and more!
                </h1>
                <p>
                    <strong>Welcome!</strong> <br>
                    Feel free to take a look around.
                </p>
            `
        },
        minecraft: {
            title: "Minecraft",
            content: `
                <h1 align="center">My Minecraft Server</h1>
                <p>
                    I have a Minecraft server with various different worlds and gamemodes. Take a look! The address is: <br>
                    <span id="serverAddress" style="color:red;">mc.felixband.nl</span>
                    <button onclick="copyToClipboard()">Copy Address</button> <br>
                    You can play on both Java and Bedrock edition and on any version of Minecraft.
                </p>       
            `
        },
        bandit: {
            title: "Bandit",
            content: `
                <h1 align="center">Bandit - Game Launcher</h1>
                <p>
                    Bandit is an app I made to easily install and play games, even with your friends! You can install it 
                    <a href="https://github.com/FelixBand/Bandit/releases/latest" target="_blank">here</a>.
                </p>  
            `
        },
        about: {
            title: "About Me",
            content: `
                <h1 align="center">About Me</h1>
                <p>
                    I'm Felix! I love nerding out; programming, making games, making apps, making computers, making movies, etcetera.
                    <br>
                    Check out all the tabs on this site to see what kind of stuff I made!
                </p>
            `
        },
        games: {
            title: "Games",
            content: `
                <h1 align="center">Games</h1>
                <p>
                    On this page, you can find some cool games, some of which I've made myself in my free time. Those include a full remake of
                    <a href="https://store.steampowered.com/app/319510/Five_Nights_at_Freddys" target="_blank">Five Nights at Freddy's</a>
                    built from the ground up in Scratch by me. <a href="https://thuis.felixband.nl/fnaf" target="_blank">Click here to play!</a>
                </p>
                <p>
                    Beside that, I've also made a very modular remake of 
                    <a href="https://ninja-muffin24.itch.io/funkin" target="_blank">Friday Night Funkin'</a>
                    in Scratch. <a href="https://thuis.felixband.nl/fnf" target="_blank">Click here to play!</a>
                </p>
                <p>
                    You can also play a browser-based version of 
                    <a href="https://minecraft.net" target="_blank">Minecraft</a>
                    built in JavaScript by <a href="https://lax1dude.net/" target="_blank">lax1dude</a>.
                    <a href="https://thuis.felixband.nl/eaglercraftx-wasm.html" target="_blank">Click here to play!</a>
                    <br>
                    <strong>Note:</strong> This game works on iPhone/iPad, but you'll need to run iOS/iPadOS 27 or later.
                </p>
                <p>
                    For some awesome non-browser based games, check out my project 
                    <a href="https://thuis.felixband.nl?page=bandit" target="">Bandit - Game Launcher!</a>
                </p>
            `
        },
        music: {
            title: "Music",
            content: `
                <h1 align="center">
                    My music service.
                </h1>
                <p>
                    <strong>Plug in the loudspeaker!</strong> <br>
                    Visit my <a href="https://music.felixband.nl" target="_blank">music service</a>!
                </p>
            `
        },
        movies: {
            title: "Movies",
            content: `
                <h1 align="center">
                    Watch some cool movies I like.
                </h1>
                <p>
                    <strong>Grab some popcorn!</strong> <br>
                    Visit my <a href="http://movies.felixband.nl" target="_blank">movie repository</a>!
                </p>
            `
        },
        mailbox: {
            title: "Mailbox",
            content: `
                <h1 align="center">Mailbox</h1>
                <p>Send me a message! Check back on this page to see if I have replied.</p>
                <form id="mailForm" onsubmit="return false;">
                    <label for="username">Your Name:</label><br>
                    <input type="text" id="username" name="username" required><br>
                    <label for="message">Your Message:</label><br>
                    <textarea id="message" name="message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
                <p id="statusMessage"></p>
                <hr>
                <h2 align="center">Message Wall</h2>
                <p class="date-info">(Date is formatted as dd/mm/yyyy and time is GMT+1)</p>
                <div id="messagesWall"></div> <!-- Message wall will appear here -->
            `
        }
    };

    // Function to get the current page from the URL
    function getPage() {
        const params = new URLSearchParams(window.location.search);
        return params.get("page") || "index"; // Default to Home
    }

    // Function to load the messages for the mailbox page
    function loadMessages() {
        fetch('msgs.json')
            .then(response => response.json())
            .then(data => {
                const messagesWall = document.getElementById('messagesWall');
                messagesWall.innerHTML = ''; // Clear any existing content

                // Iterate through the messages and replies
                data.forEach(msg => {
                    const messageBox = document.createElement('div');
                    messageBox.classList.add('messageBox');

                    messageBox.innerHTML = `
                        <div class="name">${msg.name}</div>
                        <div class="date">Sent at: ${msg.date}</div>
                        <div class="message">${msg.message}</div>
                        <div class="reply"><strong>Reply:</strong> ${msg.reply}</div>
                    `;

                    messagesWall.appendChild(messageBox);
                });
            })
            .catch(error => {
                console.error("Error fetching messages:", error);
                document.getElementById('messagesWall').innerHTML = "Error loading messages.";
            });
    }

    function updateActiveNav() {
        const page = getPage(); // Get the current page
        const navLinks = document.querySelectorAll(".topnav a");
    
        navLinks.forEach(link => {
            // Remove 'active' class from all links
            link.classList.remove("active");
    
            // Check if the href includes the correct page name
            const linkPage = new URL(link.href).searchParams.get("page") || "index";
            if (linkPage === page) {
                link.classList.add("active");
            }
        });
    }    

    // Function to load the content of the page
    function loadPage() {
        const page = getPage();
        if (pages[page]) {
            document.getElementById("page-title").innerText = pages[page].title;
            document.getElementById("content").innerHTML = pages[page].content;
    
            if (page === "mailbox") {
                loadMessages();
            }
    
            updateActiveNav(); // Add this line to update the navbar
        } else {
            document.getElementById("content").innerHTML = "<h1>404 - Page Not Found</h1>";
        }
    }    

    loadPage(); // Load the selected page
});
