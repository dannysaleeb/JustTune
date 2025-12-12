export default function Settings({ settings, setSettings }) {

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
                    checked={settings.enharmonicToggle}
                    onChange={() =>
                        setSettings(prev => ({ 
                            ...prev, 
                            enharmonicToggle: prev.enharmonicToggle === 1 ? 0 : 1
                        }))
                    }
                    />
                    Enharmonic flip
                </label>
            </div>

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
