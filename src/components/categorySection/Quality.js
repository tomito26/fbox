const Quality = () =>{
    return(
        <div className="qualityMenu">
            <div className="form-check">
                <input type="checkbox" name="HD" id="hd" />
                <label htmlFor="hd">HD</label>
            </div>
            <div className="form-check">
                <input type="checkbox" name="HDRip" id="hdrip" />
                <label htmlFor="hdrip">HRip</label>
            </div>
            <div className="form-check">
                <input type="checkbox" name="SD" id="sd" />
                <label htmlFor="sd">SD</label>
            </div>
            <div className="form-check">
                <input type="checkbox" name="TS" id="ts" />
                <label htmlFor="ts">TS</label>
            </div>
            <div className="form-check">
                <input type="checkbox" name="CAM" id="cam" />
                <label htmlFor="cam">CAM</label>
            </div>
        </div>
    )
}

export default Quality;