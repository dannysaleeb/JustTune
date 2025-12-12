export default function Settings({ settings, setSettings, flippedNotes, setFlippedNotes }) {

    const flippedAllTrue = flippedNotes.every(v => v === true);

    return (
        <div>
            <div>
                <label>
                    <input
                    type="checkbox"
                    checked={settings.doubles}
                    onChange={() =>
                        setSettings(prev => ({ ...prev, doubles: !prev.doubles }))
                    }
                    />
                    Allow double sharps / flats
                </label>
            </div>
            
            <div>
                <label>
                    <input
                    type="checkbox"
                    checked={settings.naturals}
                    onChange={() =>
                        setSettings(prev => ({ ...prev, naturals: !prev.naturals }))
                    }
                    />
                    Show naturals
                </label>
            </div>

            <div>
                <label>
                    <input
                    type="checkbox"
                    checked={settings.colours}
                    onChange={() =>
                        setSettings(prev => ({ ...prev, colours: !prev.colours }))
                    }
                    />
                    Colours
                </label>
            </div>

            <div>
                <label>
                    <input
                    type="checkbox"
                    checked={flippedAllTrue} // what should this be?
                    onChange={() =>
                        setFlippedNotes(prev => {
                            const allTrue = prev.every(v => v === true);
                            return prev.map(() => !allTrue)
                        })
                    }
                    />
                    Enharmonic FLIP!
                </label>
            </div>

            {/* It would be useful for enharmonic flip to choose double flat or double sharp intelligently where necessary */}

            <div>
                <label>
                    Max partials:
                    <input
                    type="number"
                    value={settings.maxPartials}
                    onChange={e =>
                        setSettings(prev => ({
                        ...prev,
                        maxPartials: Number(e.target.value)
                        }))
                    }
                    />
                </label>
            </div>
                
        </div>
    )
}
