(function () {
    "use strict";

    var statusLabels = {
        "open": "Open",
        "partially-solved": "Partially solved",
        "solved": "Solved"
    };

    function isNonEmptyString(value) {
        return typeof value === "string" && value.trim() !== "";
    }

    function validateStringArray(values, label, allowEmpty) {
        if (!Array.isArray(values) || (!allowEmpty && values.length === 0) ||
                values.some(function (value) { return !isNonEmptyString(value); })) {
            throw new Error("The catalogue has an invalid " + label + " field.");
        }
    }

    function validateCatalogue(catalogue) {
        var codes = new Set();
        var slugs = new Set();

        if (!catalogue || typeof catalogue !== "object" || catalogue.version !== 1 ||
                !Array.isArray(catalogue.problems)) {
            throw new Error("The problem catalogue has an invalid format.");
        }

        catalogue.problems.forEach(function (problem) {
            ["code", "slug", "title", "summary", "status", "content", "posedOn"]
                .forEach(function (field) {
                    if (!isNonEmptyString(problem[field])) {
                        throw new Error("A problem is missing its " + field + " field.");
                    }
                });

            if (!/^[A-Z]{1,4}[0-9]{1,3}[a-z]?$/.test(problem.code) || codes.has(problem.code)) {
                throw new Error("The catalogue contains an invalid or duplicate problem code.");
            }
            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(problem.slug) || slugs.has(problem.slug)) {
                throw new Error("The catalogue contains an invalid or duplicate problem slug.");
            }
            if (!Object.prototype.hasOwnProperty.call(statusLabels, problem.status)) {
                throw new Error("The catalogue contains an unknown problem status.");
            }
            if (typeof problem.hidden !== "boolean") {
                throw new Error("A problem is missing its hidden flag.");
            }
            if (problem.status === "solved" && !isNonEmptyString(problem.resolvedOn)) {
                throw new Error("A solved problem is missing its resolvedOn field.");
            }
            if (problem.resolvedOn !== undefined &&
                    !isNonEmptyString(problem.resolvedOn)) {
                throw new Error("A problem has an invalid resolvedOn field.");
            }
            if (problem.lastUpdated !== undefined &&
                    !isNonEmptyString(problem.lastUpdated)) {
                throw new Error("A problem has an invalid lastUpdated field.");
            }
            if (!/^entries\/[a-z0-9]+(?:-[a-z0-9]+)*\.html$/.test(problem.content)) {
                throw new Error("The catalogue contains an invalid problem content path.");
            }

            validateStringArray(problem.topics, "topics", false);
            validateStringArray(problem.areas, "areas", false);
            validateStringArray(problem.tags, "tags", true);
            if (problem.posedBy !== undefined) {
                validateStringArray(problem.posedBy, "posedBy", false);
            }

            codes.add(problem.code);
            slugs.add(problem.slug);
        });

        return catalogue;
    }

    function loadCatalogue() {
        return fetch("data/problems.json", { cache: "no-store" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Could not load the problem catalogue.");
                }
                return response.json();
            })
            .then(validateCatalogue);
    }

    function statusLabel(status) {
        return statusLabels[status] || status;
    }

    function formatDate(value) {
        var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        var months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) {
            return value;
        }

        return Number(match[3]) + " " + months[Number(match[2]) - 1] + " " + match[1];
    }

    function setState(heading, message) {
        var state = document.getElementById("problem-state");
        var stateHeading = document.getElementById("state-heading");
        var stateMessage = document.getElementById("state-message");

        stateHeading.textContent = heading;
        stateMessage.textContent = message || "";
        state.hidden = false;
    }

    function createProblemItem(problem) {
        var item = document.createElement("li");
        var itemHeader = document.createElement("div");
        var code = document.createElement("span");
        var status = document.createElement("span");
        var visibility = document.createElement("span");
        var heading = document.createElement("h3");
        var link = document.createElement("a");
        var summary = document.createElement("p");
        var topics = document.createElement("p");

        item.className = "problem-list-item";
        itemHeader.className = "problem-list-header";
        code.className = "problem-code";
        code.textContent = problem.code;
        status.className = "status-badge status-" + problem.status;
        status.textContent = statusLabel(problem.status);
        itemHeader.appendChild(code);
        itemHeader.appendChild(status);
        if (problem.hidden) {
            visibility.className = "visibility-badge visibility-hidden";
            visibility.textContent = "Hidden locally";
            itemHeader.appendChild(visibility);
        }

        link.href = "problem.html?problem=" + encodeURIComponent(problem.slug);
        link.textContent = problem.title;
        heading.appendChild(link);

        summary.className = "problem-list-summary";
        summary.textContent = problem.summary;

        topics.className = "problem-list-areas";
        topics.textContent = problem.topics.join(" / ");

        item.appendChild(itemHeader);
        item.appendChild(heading);
        item.appendChild(summary);
        item.appendChild(topics);
        return item;
    }

    function initialiseIndex(catalogue) {
        var problems = catalogue.problems.slice();
        var list = document.getElementById("problem-list");
        var state = document.getElementById("problem-state");

        problems.sort(function (first, second) {
            return first.code.localeCompare(second.code, undefined, { numeric: true });
        });

        list.replaceChildren();
        problems.forEach(function (problem) {
            list.appendChild(createProblemItem(problem));
        });

        if (problems.length === 0) {
            setState("Collection in preparation", "No problems have been published here yet.");
        } else {
            state.hidden = true;
        }
    }

    function appendMetadata(metadata, label, values) {
        var term;
        var description;

        if (!values || (Array.isArray(values) && values.length === 0)) {
            return;
        }

        term = document.createElement("dt");
        description = document.createElement("dd");
        term.textContent = label;
        description.textContent = Array.isArray(values) ? values.join(", ") : values;
        metadata.appendChild(term);
        metadata.appendChild(description);
    }

    function appendProposerMetadata(metadata, posedBy) {
        var collaborators;

        if (!posedBy) {
            return;
        }

        collaborators = posedBy.filter(function (name) {
            return name !== "Peleg Michaeli";
        }).sort(function (firstName, secondName) {
            var firstParts = firstName.trim().split(/\s+/);
            var secondParts = secondName.trim().split(/\s+/);
            var surnameComparison = firstParts[firstParts.length - 1].localeCompare(
                secondParts[secondParts.length - 1],
                "en"
            );

            return surnameComparison || firstName.localeCompare(secondName, "en");
        });

        if (collaborators.length === 0) {
            return;
        }

        appendMetadata(
            metadata,
            posedBy.includes("Peleg Michaeli") ? "Proposed with" : "Proposed by",
            collaborators
        );
    }

    function loadProblemContent(problem) {
        var contentUrl = new URL(problem.content, window.location.href);
        var entriesRoot = new URL("entries/", window.location.href);

        if (contentUrl.origin !== entriesRoot.origin ||
                !contentUrl.pathname.startsWith(entriesRoot.pathname) ||
                contentUrl.search || contentUrl.hash) {
            return Promise.reject(new Error("The problem content path is invalid."));
        }

        return fetch(contentUrl, { cache: "no-store" }).then(function (response) {
            if (!response.ok) {
                throw new Error("Could not load the problem text.");
            }
            return response.text();
        });
    }

    function initialiseDetail(catalogue) {
        var slug = new URLSearchParams(window.location.search).get("problem");
        var problem = catalogue.problems.find(function (candidate) {
            return candidate.slug === slug;
        });

        if (!slug) {
            setState("No problem selected", "Choose a published problem from the collection.");
            document.title = "Problem not selected - Peleg Michaeli";
            return;
        }

        if (!problem) {
            setState("Problem not found", "This problem is not part of the published collection.");
            document.title = "Problem not found - Peleg Michaeli";
            return;
        }

        setState("Loading problem...", "");
        loadProblemContent(problem).then(function (content) {
            var detail = document.getElementById("problem-detail");
            var state = document.getElementById("problem-state");
            var metadata = document.getElementById("problem-metadata");
            var code = document.getElementById("problem-code");
            var status = document.getElementById("problem-status-badge");
            var visibility = document.getElementById("problem-visibility-badge");

            document.getElementById("problem-title").textContent = problem.title;
            document.getElementById("problem-summary").textContent = problem.summary;
            document.getElementById("problem-content").innerHTML = content;

            code.textContent = problem.code;
            status.textContent = statusLabel(problem.status);
            status.className = "status-badge status-" + problem.status;
            visibility.hidden = !problem.hidden;

            metadata.replaceChildren();
            appendMetadata(metadata, "Topics", problem.topics);
            appendProposerMetadata(metadata, problem.posedBy);
            appendMetadata(metadata, "Date posed", formatDate(problem.posedOn));
            appendMetadata(metadata, "Date resolved", formatDate(problem.resolvedOn));
            appendMetadata(metadata, "Last updated", formatDate(problem.lastUpdated));

            document.title = problem.title + " - Peleg Michaeli";
            state.hidden = true;
            detail.hidden = false;
        }).catch(function (error) {
            setState("Problem unavailable", error.message);
            document.title = "Problem unavailable - Peleg Michaeli";
        });
    }

    var page = document.body.dataset.page;
    loadCatalogue().then(function (catalogue) {
        if (page === "index") {
            initialiseIndex(catalogue);
        } else if (page === "detail") {
            initialiseDetail(catalogue);
        }
    }).catch(function (error) {
        setState("Catalogue unavailable", error.message);
    });
}());
