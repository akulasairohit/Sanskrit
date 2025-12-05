"use client";

import { FileText, Download, ExternalLink } from "lucide-react";

export function Resources() {
    const resources = [
        {
            title: "Bhagavad Gītā",
            description: "Divine incarnation principle (avatāra). 'Whenever there is decline of dharma... I manifest Myself.'",
            type: "Smriti",
            edition: "Gītā Press Critical Edition"
        },
        {
            title: "Chāndogya Upaniṣad",
            description: "Contains the Mahāvākya 'Tat Tvam Asi' (Thou art That), establishing the identity of individual and universal consciousness.",
            type: "Shruti",
            edition: "Ānandāśrama Sanskrit Series"
        },
        {
            title: "Ṛgveda",
            description: "The oldest Veda. Contains the famous axiom 'Ekam Sat Vipra Bahudha Vadanti' (Truth is One, the wise call it by many names).",
            type: "Shruti",
            edition: "Max Müller Critical Edition"
        },
        {
            title: "Īśāvāsya Upaniṣad",
            description: "Opening verse establishing divine immanence: 'All this is pervaded by the Lord. Enjoy through renunciation.'",
            type: "Shruti",
            edition: "Eighteen Principal Upaniṣads"
        },
        {
            title: "Vivekacūḍāmaṇi",
            description: "Adi Shankara's masterpiece on Advaita Vedanta. 'Brahman is real, the world is apparent.'",
            type: "Prakarana",
            edition: "Advaita Ashrama"
        },
        {
            title: "Śrīmad Bhāgavatam",
            description: "The Maha Purana focusing on Bhakti. Includes the Gajendra Moksha Stotram and Krishna's pastimes.",
            type: "Purana",
            edition: "Gītā Press"
        }
    ];

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto pb-24 md:pb-6">
            <div className="space-y-2 mt-4 md:mt-6">
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">Resources</h2>
                <p className="text-muted-foreground">
                    Download essential texts and reference materials for your Sanskrit studies.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((resource, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
                                {resource.type} • {resource.edition}
                            </span>
                        </div>

                        <h3 className="text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                            {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 flex-1">
                            {resource.description}
                        </p>

                        <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all font-medium text-sm">
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-background shadow-sm">
                        <ExternalLink className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="font-medium text-foreground">External Libraries</h3>
                        <p className="text-sm text-muted-foreground">
                            Access thousands of digitized manuscripts at the Digital Library of India and Gretil.
                        </p>
                    </div>
                    <button className="ml-auto px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline">
                        Visit Library &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
}
