import { PresetType } from "../../../core/models/domain/types";
interface AppPresetFilterProps {
    selectedPreset: PresetType;
    onSelectPresetTap: (preset: PresetType) => void;
}

export function AppPresetFilter(props: AppPresetFilterProps) {
    return (
        <div className="btn-group mr-2">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => props.onSelectPresetTap('my')}>My Items</button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => props.onSelectPresetTap('open')} > Open Items</button >
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={(e) => props.onSelectPresetTap('closed')} > Done Items</button >
        </div >
    );
};
