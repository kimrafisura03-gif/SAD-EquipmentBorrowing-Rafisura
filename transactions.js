import { supabase } from "./supabase.js";
import { checkUser } from "./auth.js";


// ==========================================
// CHECK USER
// ==========================================

const user = await checkUser();

if (!user) {
    throw new Error("User not authenticated.");
}



// ==========================================
// VARIABLES
// ==========================================

let allTransactions = [];



// ==========================================
// LOAD TRANSACTIONS
// ==========================================

async function loadTransactions() {

    const {
        data,
        error
    } = await supabase
        .from("borrow_transactions")
        .select(`
            *,
            equipment (
                equipment_name,
                asset_code
            )
        `)
        .order("id", {
            ascending: false
        });


    if (error) {

        console.error(error);

        alert(
            "Error loading transactions: " +
            error.message
        );

        return;

    }


    allTransactions =
        data || [];


    await updateOverdueTransactions();

}



// ==========================================
// UPDATE OVERDUE
// ==========================================

async function updateOverdueTransactions() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    for (
        const transaction
        of allTransactions
    ) {

        if (

            transaction.status !==
                "Returned"

            &&

            transaction.due_date <
                today

            &&

            transaction.status !==
                "Overdue"

        ) {

            const {
                error
            } = await supabase
                .from(
                    "borrow_transactions"
                )
                .update({
                    status: "Overdue"
                })
                .eq(
                    "id",
                    transaction.id
                );


            if (error) {

                console.error(
                    "Overdue update error:",
                    error
                );

            }

        }

    }


    const {
        data,
        error
    } = await supabase
        .from("borrow_transactions")
        .select(`
            *,
            equipment (
                equipment_name,
                asset_code
            )
        `)
        .order("id", {
            ascending: false
        });


    if (error) {

        console.error(error);

        return;

    }


    allTransactions =
        data || [];


    displayTransactions(
        allTransactions
    );

}



// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions(data) {

    const tbody =
        document.getElementById(
            "transactionTableBody"
        );


    tbody.innerHTML = "";


    if (data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No transactions found.
                </td>
            </tr>
        `;

        return;

    }


    data.forEach(transaction => {

        const row =
            document.createElement("tr");


        let status =
            transaction.status;


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        if (
            status !== "Returned" &&
            transaction.due_date < today
        ) {

            status = "Overdue";

        }


        let statusClass =
            "status-borrowed";


        if (status === "Returned") {

            statusClass =
                "status-returned";

        }


        if (status === "Overdue") {

            statusClass =
                "status-overdue";

        }


        let action = "";


        if (
            status !== "Returned"
        ) {

            action = `

                <button
                    class="small-btn return-btn"
                    data-id="${transaction.id}"
                >
                    Return
                </button>

            `;

        } else {

            action = `
                <span class="returned-text">
                    Completed
                </span>
            `;

        }


        const equipmentName =
            transaction.equipment
                ? transaction.equipment
                    .equipment_name
                : "Unknown";


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    transaction.borrower_name
                )}
                <br>
                <small>
                    ${escapeHTML(
                        transaction.borrower_type
                    )}
                </small>
            </td>


            <td>
                ${escapeHTML(
                    equipmentName
                )}
                <br>
                <small>
                    ${escapeHTML(
                        transaction.equipment
                            ? transaction.equipment.asset_code
                            : ""
                    )}
                </small>
            </td>


            <td>
                ${formatDate(
                    transaction.date_borrowed
                )}
            </td>


            <td>
                ${formatDate(
                    transaction.due_date
                )}
            </td>


            <td>
                ${
                    transaction.date_returned
                    ?
                    formatDate(
                        transaction.date_returned
                    )
                    :
                    "-"
                }
            </td>


            <td>
                <span
                    class="status ${statusClass}"
                >
                    ${status}
                </span>
            </td>


            <td>
                ${action}
            </td>

        `;


        tbody.appendChild(row);

    });


    document
        .querySelectorAll(".return-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    returnEquipment(
                        button.dataset.id
                    )
            );

        });

}



// ==========================================
// BORROW EQUIPMENT
// ==========================================

document
    .getElementById("borrowForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const borrowerName =
                document
                    .getElementById(
                        "borrowerName"
                    )
                    .value.trim();


            const borrowerType =
                document
                    .getElementById(
                        "borrowerType"
                    )
                    .value;


            const department =
                document
                    .getElementById(
                        "department"
                    )
                    .value.trim();


            const equipmentId =
                document
                    .getElementById(
                        "borrowEquipment"
                    )
                    .value;


            const dateBorrowed =
                document
                    .getElementById(
                        "dateBorrowed"
                    )
                    .value;


            const dueDate =
                document
                    .getElementById(
                        "dueDate"
                    )
                    .value;


            const message =
                document
                    .getElementById(
                        "borrowMessage"
                    );


            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (!borrowerName) {

                showMessage(
                    message,
                    "Borrower name is required.",
                    "error"
                );

                return;

            }


            if (!borrowerType) {

                showMessage(
                    message,
                    "Please select borrower type.",
                    "error"
                );

                return;

            }


            if (!department) {

                showMessage(
                    message,
                    "Department is required.",
                    "error"
                );

                return;

            }


            if (!equipmentId) {

                showMessage(
                    message,
                    "Please select equipment.",
                    "error"
                );

                return;

            }


            if (!dateBorrowed) {

                showMessage(
                    message,
                    "Borrowing date is required.",
                    "error"
                );

                return;

            }


            if (!dueDate) {

                showMessage(
                    message,
                    "Due date is required.",
                    "error"
                );

                return;

            }


            // BR-05
            if (
                dueDate <
                dateBorrowed
            ) {

                showMessage(
                    message,
                    "Due date cannot be earlier than borrowing date.",
                    "error"
                );

                return;

            }



            // -----------------------------
            // CHECK EQUIPMENT
            // -----------------------------

            const {
                data: equipment,
                error:
                    equipmentError
            } = await supabase
                .from("equipment")
                .select("*")
                .eq(
                    "id",
                    equipmentId
                )
                .single();


            if (equipmentError) {

                showMessage(
                    message,
                    equipmentError.message,
                    "error"
                );

                return;

            }


            // BR-03
            if (
                equipment.availability !==
                "Available"
            ) {

                showMessage(
                    message,
                    "Only available equipment may be borrowed.",
                    "error"
                );

                return;

            }



            // -----------------------------
            // CREATE TRANSACTION
            // -----------------------------

            const {
                data: transaction,
                error
            } = await supabase
                .from(
                    "borrow_transactions"
                )
                .insert({

                    equipment_id:
                        equipmentId,

                    borrower_name:
                        borrowerName,

                    borrower_type:
                        borrowerType,

                    department:
                        department,

                    date_borrowed:
                        dateBorrowed,

                    due_date:
                        dueDate,

                    status:
                        "Borrowed",

                    user_id:
                        user.id

                })
                .select()
                .single();


            if (error) {

                showMessage(
                    message,
                    "Error saving transaction: " +
                    error.message,
                    "error"
                );

                return;

            }



            // -----------------------------
            // UPDATE EQUIPMENT
            // -----------------------------

            const {
                error:
                    updateError
            } = await supabase
                .from("equipment")
                .update({

                    availability:
                        "Borrowed"

                })
                .eq(
                    "id",
                    equipmentId
                );


            if (updateError) {

                // Rollback transaction
                await supabase
                    .from(
                        "borrow_transactions"
                    )
                    .delete()
                    .eq(
                        "id",
                        transaction.id
                    );


                showMessage(
                    message,
                    "Could not update equipment: " +
                    updateError.message,
                    "error"
                );

                return;

            }



            // -----------------------------
            // SUCCESS
            // -----------------------------

            showMessage(
                message,
                "Borrowing transaction saved successfully!",
                "success"
            );


            document
                .getElementById(
                    "borrowForm"
                )
                .reset();


            document
                .getElementById(
                    "dateBorrowed"
                )
                .value =
                new Date()
                    .toISOString()
                    .split("T")[0];


            await loadTransactions();


            // Refresh equipment
            window.dispatchEvent(
                new Event(
                    "equipmentChanged"
                )
            );

        }
    );



// ==========================================
// RETURN EQUIPMENT
// ==========================================

async function returnEquipment(
    transactionId
) {

    const transaction =
        allTransactions.find(
            item =>
                String(item.id) ===
                String(transactionId)
        );


    if (!transaction) {

        alert(
            "Transaction not found."
        );

        return;

    }


    if (
        transaction.status ===
        "Returned"
    ) {

        alert(
            "This transaction has already been returned."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to return this equipment?"
        );


    if (!confirmed) {
        return;
    }


    const returnDate =
        new Date()
            .toISOString()
            .split("T")[0];



    // -----------------------------
    // UPDATE TRANSACTION
    // -----------------------------

    const {
        error:
            transactionError
    } = await supabase
        .from(
            "borrow_transactions"
        )
        .update({

            date_returned:
                returnDate,

            status:
                "Returned"

        })
        .eq(
            "id",
            transactionId
        );


    if (transactionError) {

        alert(
            "Return failed: " +
            transactionError.message
        );

        return;

    }



    // -----------------------------
    // UPDATE EQUIPMENT
    // -----------------------------

    const {
        error:
            equipmentError
    } = await supabase
        .from("equipment")
        .update({

            availability:
                "Available"

        })
        .eq(
            "id",
            transaction.equipment_id
        );


    if (equipmentError) {

        alert(
            "Equipment status update failed: " +
            equipmentError.message
        );

        return;

    }


alert("Equipment returned successfully.");

await loadTransactions();

// Refresh equipment table and dashboard
window.dispatchEvent(new Event("equipmentChanged"));

}



// ==========================================
// SEARCH TRANSACTIONS
// ==========================================

document
    .getElementById(
        "transactionSearch"
    )
    .addEventListener(
        "input",
        filterTransactions
    );


document
    .getElementById(
        "transactionStatusFilter"
    )
    .addEventListener(
        "change",
        filterTransactions
    );


function filterTransactions() {

    const search =
        document
            .getElementById(
                "transactionSearch"
            )
            .value
            .toLowerCase()
            .trim();


    const statusFilter =
        document
            .getElementById(
                "transactionStatusFilter"
            )
            .value;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const filtered =
        allTransactions.filter(
            transaction => {

                const borrower =
                    transaction
                        .borrower_name
                        .toLowerCase();


                const equipmentName =
                    transaction.equipment
                    ?
                    transaction
                        .equipment
                        .equipment_name
                        .toLowerCase()
                    :
                    "";


                let status =
                    transaction.status;


                if (
                    status !== "Returned" &&
                    transaction.due_date <
                        today
                ) {

                    status = "Overdue";

                }


                const matchesSearch =
                    borrower.includes(
                        search
                    )
                    ||
                    equipmentName.includes(
                        search
                    );


                const matchesStatus =
                    statusFilter ===
                        "All"
                    ||
                    status ===
                        statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    displayTransactions(
        filtered
    );

}



// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) {
        return "-";
    }


    const parts =
        date.split("-");


    return `${parts[1]}/${parts[2]}/${parts[0]}`;

}



// ==========================================
// MESSAGE
// ==========================================

function showMessage(
    element,
    text,
    type
) {

    element.textContent =
        text;

    element.className =
        "message " + type;

}



// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



// ==========================================
// INITIAL LOAD
// ==========================================

loadTransactions();
