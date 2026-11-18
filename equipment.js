```html
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Dashboard | Equipment Borrowing System
    </title>

    <link
        rel="stylesheet"
        href="style.css"
    >

</head>


<body>

    <!-- =====================================
         SIDEBAR
    ====================================== -->

    <aside class="sidebar">

        <div class="logo-area">

            <div class="logo-circle">
                EBS
            </div>

            <div>
                <h2>EBS</h2>

                <span>
                    Equipment System
                </span>
            </div>

        </div>


        <nav>

            <button
                type="button"
                class="nav-btn active"
                data-section="dashboardSection"
            >
                Dashboard
            </button>


            <button
                type="button"
                class="nav-btn"
                data-section="equipmentSection"
            >
                Equipment
            </button>


            <button
                type="button"
                class="nav-btn"
                data-section="transactionsSection"
            >
                Transactions
            </button>


            <button
                type="button"
                class="nav-btn"
                data-section="addEquipmentSection"
            >
                Add Equipment
            </button>


            <button
                type="button"
                class="nav-btn"
                data-section="borrowSection"
            >
                Record Borrowing
            </button>

        </nav>


        <div class="sidebar-bottom">

            <button
                type="button"
                id="logoutButton"
                class="logout-btn"
            >
                Logout
            </button>

        </div>

    </aside>



    <!-- =====================================
         MAIN CONTENT
    ====================================== -->

    <main class="main-content">


        <!-- =====================================
             HEADER
        ====================================== -->

        <header class="top-header">

            <div>

                <h1>
                    Equipment Borrowing Monitoring System
                </h1>

                <p>
                    Manage equipment and borrowing transactions
                </p>

            </div>


            <div class="user-info">

                <span>
                    Logged in as:
                </span>

                <strong id="userEmail">
                    Loading...
                </strong>

            </div>

        </header>



        <!-- =====================================
             DASHBOARD
        ====================================== -->

        <section
            id="dashboardSection"
            class="page-section active-section"
        >

            <div class="section-title">

                <div>

                    <h2>
                        Dashboard
                    </h2>

                    <p>
                        Overview of equipment and transactions
                    </p>

                </div>

            </div>


            <div class="stats-grid">


                <div class="stat-card">

                    <div class="stat-icon">
                        📦
                    </div>

                    <div>

                        <span>
                            Total Equipment
                        </span>

                        <strong id="totalEquipment">
                            0
                        </strong>

                    </div>

                </div>



                <div class="stat-card">

                    <div class="stat-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Available
                        </span>

                        <strong id="availableEquipment">
                            0
                        </strong>

                    </div>

                </div>



                <div class="stat-card">

                    <div class="stat-icon">
                        ↗
                    </div>

                    <div>

                        <span>
                            Borrowed
                        </span>

                        <strong id="borrowedEquipment">
                            0
                        </strong>

                    </div>

                </div>



                <div class="stat-card overdue-card">

                    <div class="stat-icon">
                        !
                    </div>

                    <div>

                        <span>
                            Overdue
                        </span>

                        <strong id="overdueEquipment">
                            0
                        </strong>

                    </div>

                </div>

            </div>



            <div class="content-card">

                <div class="card-header">

                    <div>

                        <h3>
                            Recent Equipment
                        </h3>

                        <p>
                            Current equipment records
                        </p>

                    </div>


                    <button
                        type="button"
                        class="primary-btn"
                        id="dashboardAddButton"
                    >
                        + Add Equipment
                    </button>

                </div>


                <div class="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Asset Code
                                </th>

                                <th>
                                    Equipment
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Condition
                                </th>

                                <th>
                                    Availability
                                </th>

                            </tr>

                        </thead>


                        <tbody id="dashboardEquipmentBody">

                        </tbody>

                    </table>

                </div>

            </div>

        </section>



        <!-- =====================================
             EQUIPMENT
        ====================================== -->

        <section
            id="equipmentSection"
            class="page-section"
        >

            <div class="section-title">

                <div>

                    <h2>
                        Equipment
                    </h2>

                    <p>
                        Manage college equipment
                    </p>

                </div>


                <button
                    type="button"
                    class="primary-btn"
                    id="equipmentAddButton"
                >
                    + Add Equipment
                </button>

            </div>


            <div class="content-card">


                <div class="search-filter-bar">

                    <input
                        type="text"
                        id="equipmentSearch"
                        placeholder="Search equipment or asset code..."
                    >


                    <select id="availabilityFilter">

                        <option value="All">
                            All Availability
                        </option>

                        <option value="Available">
                            Available
                        </option>

                        <option value="Borrowed">
                            Borrowed
                        </option>

                    </select>

                </div>


                <div class="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Asset Code
                                </th>

                                <th>
                                    Equipment
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Condition
                                </th>

                                <th>
                                    Availability
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody id="equipmentTableBody">

                        </tbody>

                    </table>

                </div>

            </div>

        </section>



        <!-- =====================================
             ADD EQUIPMENT
        ====================================== -->

        <section
            id="addEquipmentSection"
            class="page-section"
        >

            <div class="section-title">

                <div>

                    <h2>
                        Add Equipment
                    </h2>

                    <p>
                        Create a new equipment record
                    </p>

                </div>

            </div>


            <div class="content-card form-card">

                <form id="equipmentForm">


                    <div class="form-row">

                        <div class="form-group">

                            <label>
                                Equipment Name
                            </label>

                            <input
                                type="text"
                                id="equipmentName"
                                placeholder="Example: Epson Projector"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                id="equipmentCategory"
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Laptop">
                                    Laptop
                                </option>

                                <option value="Projector">
                                    Projector
                                </option>

                                <option value="Camera">
                                    Camera
                                </option>

                                <option value="Microphone">
                                    Microphone
                                </option>

                                <option value="Router">
                                    Router
                                </option>

                                <option value="Extension Cord">
                                    Extension Cord
                                </option>

                                <option value="HDMI Cable">
                                    HDMI Cable
                                </option>

                                <option value="Computer Toolkit">
                                    Computer Toolkit
                                </option>

                                <option value="Portable Speaker">
                                    Portable Speaker
                                </option>

                                <option value="Other ICT Equipment">
                                    Other ICT Equipment
                                </option>

                            </select>

                        </div>

                    </div>



                    <div class="form-row">

                        <div class="form-group">

                            <label>
                                Asset Code
                            </label>

                            <input
                                type="text"
                                id="assetCode"
                                placeholder="Example: PROJ-001"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Condition
                            </label>

                            <select id="equipmentCondition">

                                <option value="Good">
                                    Good
                                </option>

                                <option value="Fair">
                                    Fair
                                </option>

                                <option value="For Repair">
                                    For Repair
                                </option>

                            </select>

                        </div>

                    </div>


                    <button
                        type="submit"
                        class="primary-btn"
                    >
                        Save Equipment
                    </button>


                    <p
                        id="equipmentMessage"
                        class="message"
                    ></p>

                </form>

            </div>

        </section>



        <!-- =====================================
             BORROWING FORM
        ====================================== -->

        <section
            id="borrowSection"
            class="page-section"
        >

            <div class="section-title">

                <div>

                    <h2>
                        New Borrowing Transaction
                    </h2>

                    <p>
                        Record equipment borrowed by a user
                    </p>

                </div>

            </div>


            <div class="content-card form-card">

                <form id="borrowForm">


                    <div class="form-row">

                        <div class="form-group">

                            <label>
                                Borrower Name
                            </label>

                            <input
                                type="text"
                                id="borrowerName"
                                placeholder="Enter borrower name"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Borrower Type
                            </label>

                            <select
                                id="borrowerType"
                                required
                            >

                                <option value="">
                                    Select Type
                                </option>

                                <option value="Student">
                                    Student
                                </option>

                                <option value="Faculty">
                                    Faculty
                                </option>

                                <option value="Staff">
                                    Staff
                                </option>

                            </select>

                        </div>

                    </div>



                    <div class="form-row">

                        <div class="form-group">

                            <label>
                                Department
                            </label>

                            <input
                                type="text"
                                id="department"
                                placeholder="Enter department"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Equipment
                            </label>

                            <select
                                id="borrowEquipment"
                                required
                            >

                                <option value="">
                                    Select Available Equipment
                                </option>

                            </select>

                        </div>

                    </div>



                    <div class="form-row">

                        <div class="form-group">

                            <label>
                                Date Borrowed
                            </label>

                            <input
                                type="date"
                                id="dateBorrowed"
                                required
                            >

                        </div>


                        <div class="form-group">

                            <label>
                                Due Date
                            </label>

                            <input
                                type="date"
                                id="dueDate"
                                required
                            >

                        </div>

                    </div>


                    <button
                        type="submit"
                        class="primary-btn"
                    >
                        Save Borrowing Transaction
                    </button>


                    <p
                        id="borrowMessage"
                        class="message"
                    ></p>

                </form>

            </div>

        </section>



        <!-- =====================================
             TRANSACTIONS
        ====================================== -->

        <section
            id="transactionsSection"
            class="page-section"
        >

            <div class="section-title">

                <div>

                    <h2>
                        Borrowing Transactions
                    </h2>

                    <p>
                        View and manage borrowing records
                    </p>

                </div>

            </div>


            <div class="content-card">


                <div class="search-filter-bar">

                    <input
                        type="text"
                        id="transactionSearch"
                        placeholder="Search borrower..."
                    >


                    <select id="transactionStatusFilter">

                        <option value="All">
                            All Status
                        </option>

                        <option value="Borrowed">
                            Borrowed
                        </option>

                        <option value="Returned">
                            Returned
                        </option>

                        <option value="Overdue">
                            Overdue
                        </option>

                    </select>

                </div>


                <div class="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Borrower
                                </th>

                                <th>
                                    Equipment
                                </th>

                                <th>
                                    Date Borrowed
                                </th>

                                <th>
                                    Due Date
                                </th>

                                <th>
                                    Date Returned
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody id="transactionTableBody">

                        </tbody>

                    </table>

                </div>

            </div>

        </section>


    </main>



    <!-- =====================================
         JAVASCRIPT
    ====================================== -->

    <script type="module">

        /*
        ==========================================
        SIDEBAR NAVIGATION
        ==========================================
        */

        const navButtons =
            document.querySelectorAll(".nav-btn");

        const sections =
            document.querySelectorAll(".page-section");


        navButtons.forEach(button => {

            button.addEventListener("click", () => {

                const target =
                    button.getAttribute("data-section");


                // Remove active from all buttons

                navButtons.forEach(btn => {

                    btn.classList.remove("active");

                });


                // Add active to clicked button

                button.classList.add("active");


                // Hide all sections

                sections.forEach(section => {

                    section.classList.remove(
                        "active-section"
                    );

                });


                // Show selected section

                const selectedSection =
                    document.getElementById(target);


                if (selectedSection) {

                    selectedSection.classList.add(
                        "active-section"
                    );

                }

            });

        });



        /*
        ==========================================
        ADD EQUIPMENT BUTTON
        ==========================================
        */

        function openAddEquipment() {

            navButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            const addButton =
                document.querySelector(
                    '[data-section="addEquipmentSection"]'
                );


            if (addButton) {

                addButton.classList.add("active");

            }


            sections.forEach(section => {

                section.classList.remove(
                    "active-section"
                );

            });


            const addSection =
                document.getElementById(
                    "addEquipmentSection"
                );


            if (addSection) {

                addSection.classList.add(
                    "active-section"
                );

            }

        }



        const dashboardAddButton =
            document.getElementById(
                "dashboardAddButton"
            );


        if (dashboardAddButton) {

            dashboardAddButton.addEventListener(
                "click",
                openAddEquipment
            );

        }



        const equipmentAddButton =
            document.getElementById(
                "equipmentAddButton"
            );


        if (equipmentAddButton) {

            equipmentAddButton.addEventListener(
                "click",
                openAddEquipment
            );

        }



        /*
        ==========================================
        LOGOUT
        ==========================================
        */

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async () => {

                    try {

                        const module =
                            await import("./supabase.js");

                        const supabase =
                            module.supabase;


                        const { error } =
                            await supabase.auth.signOut();


                        if (error) {

                            alert(
                                "Logout failed: " +
                                error.message
                            );

                            return;

                        }


                        window.location.href =
                            "login.html";

                    } catch (error) {

                        console.error(error);

                        alert(
                            "Logout error. Check your Supabase connection."
                        );

                    }

                }
            );

        }

    </script>



    <!-- Your database functions -->

    <script
        type="module"
        src="equipments.js"
    ></script>


    <script
        type="module"
        src="transactions.js"
    ></script>


</body>

</html>
```
