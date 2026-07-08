import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaClone,
  FaFilter,
  FaFolderOpen,
  FaGlobeAmericas,
  FaSort,
  FaTimes,
} from "react-icons/fa";
import {
  GENRES,
  COUNTRIES,
  YEARS,
  SORTS,
  emptyFilters,
  buildDiscoverParams,
} from "./filterOptions";

// Data-driven discover filter bar. Every control is rendered from the data in
// filterOptions.js and bound to `filters` state, so the buttons/chips always
// reflect the selection and only options that map to TMDB are shown. `onFilter`
// is called with the built { type, params } when the user applies. `initialType`
// seeds the media type (TV-Series / a TV browse page start on "tv").
const DropdownMenus = ({ onFilter, initialType = "movie" }) => {
  const [openMenu, setOpenMenu] = useState(null);
  // `filters` is the draft the dropdowns edit; `applied` is what's committed and
  // drives the chip row + the actual results.
  const [filters, setFilters] = useState({ ...emptyFilters, type: initialType });
  const [applied, setApplied] = useState({ ...emptyFilters, type: initialType });
  const barRef = useRef(null);

  const toggleMenu = (name) => setOpenMenu((cur) => (cur === name ? null : name));

  // Close the open panel on an outside click.
  useEffect(() => {
    const onDown = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // TV hides genres with no clean TV equivalent (mirrors the navbar dropdown).
  const genreList = useMemo(
    () => (filters.type === "tv" ? GENRES.filter((g) => g.tvId) : GENRES),
    [filters.type]
  );

  const commit = (next) => {
    setFilters(next);
    setApplied(next);
    setOpenMenu(null);
    if (onFilter) {
      const { type, params } = buildDiscoverParams(next);
      onFilter(type, params);
    }
  };

  const toggleGenre = (label) =>
    setFilters((f) => ({
      ...f,
      genres: f.genres.includes(label)
        ? f.genres.filter((g) => g !== label)
        : [...f.genres, label],
    }));

  const setType = (type) =>
    setFilters((f) => ({
      ...f,
      type,
      // Drop genres that don't exist for the new media type.
      genres: f.genres.filter((label) => {
        const g = GENRES.find((x) => x.label === label);
        return type === "tv" ? g?.tvId : g?.id;
      }),
    }));

  const setField = (field, value) =>
    setFilters((f) => ({ ...f, [field]: f[field] === value ? "" : value }));

  const countryName = (code) => COUNTRIES.find((c) => c.code === code)?.label;
  const sortName = (id) => SORTS.find((s) => s.id === id)?.label;

  // Dropdown-button labels reflect the current draft selection.
  const genreLabel = filters.genres.length ? `Genre (${filters.genres.length})` : "Genre";
  const countryLabel = filters.country ? countryName(filters.country) : "Country";
  const yearLabel = filters.year ? `Year: ${filters.year}` : "Year";
  const sortLabel = `Sort: ${sortName(filters.sortBy)}`;
  const typeLabel = filters.type === "tv" ? "Type: TV" : "Type: Movie";

  // Chips reflect what's actually applied.
  const chips = [
    ...applied.genres.map((g) => ({
      key: `g-${g}`,
      label: g,
      onRemove: () => commit({ ...applied, genres: applied.genres.filter((x) => x !== g) }),
    })),
    applied.country && {
      key: "country",
      label: countryName(applied.country),
      onRemove: () => commit({ ...applied, country: "" }),
    },
    applied.year && {
      key: "year",
      label: applied.year,
      onRemove: () => commit({ ...applied, year: "" }),
    },
    applied.sortBy !== "default" && {
      key: "sort",
      label: sortName(applied.sortBy),
      onRemove: () => commit({ ...applied, sortBy: "default" }),
    },
  ].filter(Boolean);

  const Dropdown = ({ name, icon, label, active, children }) => (
    <div className="filter-dropdown">
      <button
        type="button"
        className={`filter-btn${active ? " has-value" : ""}${openMenu === name ? " open" : ""}`}
        aria-haspopup="true"
        aria-expanded={openMenu === name}
        onClick={() => toggleMenu(name)}
      >
        {icon}
        <span>{label}</span>
      </button>
      {openMenu === name && <div className="filter-panel">{children}</div>}
    </div>
  );

  const Option = ({ selected, onClick, children }) => (
    <button
      type="button"
      className={`filter-option${selected ? " selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className="filter-bar" ref={barRef}>
      <div className="category-section">
        <Dropdown name="type" icon={<FaClone />} label={typeLabel} active>
          <div className="filter-panel-list">
            <Option selected={filters.type === "movie"} onClick={() => setType("movie")}>
              Movie
            </Option>
            <Option selected={filters.type === "tv"} onClick={() => setType("tv")}>
              TV
            </Option>
          </div>
        </Dropdown>

        <Dropdown name="genre" icon={<FaFolderOpen />} label={genreLabel} active={filters.genres.length > 0}>
          <div className="filter-panel-grid">
            {genreList.map((g) => (
              <Option key={g.label} selected={filters.genres.includes(g.label)} onClick={() => toggleGenre(g.label)}>
                {g.label}
              </Option>
            ))}
          </div>
          <label className="filter-includeall">
            <input
              type="checkbox"
              checked={filters.includeAll}
              onChange={(e) => setFilters((f) => ({ ...f, includeAll: e.target.checked }))}
            />
            Match all selected genres
          </label>
        </Dropdown>

        <Dropdown name="country" icon={<FaGlobeAmericas />} label={countryLabel} active={!!filters.country}>
          <div className="filter-panel-grid">
            {COUNTRIES.map((c) => (
              <Option key={c.code} selected={filters.country === c.code} onClick={() => setField("country", c.code)}>
                {c.label}
              </Option>
            ))}
          </div>
        </Dropdown>

        <Dropdown name="year" icon={<FaCalendarAlt />} label={yearLabel} active={!!filters.year}>
          <div className="filter-panel-grid">
            {YEARS.map((y) => (
              <Option key={y.id} selected={filters.year === y.id} onClick={() => setField("year", y.id)}>
                {y.label}
              </Option>
            ))}
          </div>
        </Dropdown>

        <Dropdown name="sort" icon={<FaSort />} label={sortLabel} active={filters.sortBy !== "default"}>
          <div className="filter-panel-list">
            {SORTS.map((s) => (
              <Option key={s.id} selected={filters.sortBy === s.id} onClick={() => setFilters((f) => ({ ...f, sortBy: s.id }))}>
                {s.label}
              </Option>
            ))}
          </div>
        </Dropdown>

        <button className="filterBtn" onClick={() => commit(filters)}>
          <FaFilter style={{ marginRight: "5px" }} />
          Filter
        </button>
      </div>

      {chips.length > 0 && (
        <div className="filter-chips">
          {chips.map((chip) => (
            <button key={chip.key} type="button" className="filter-chip" onClick={chip.onRemove}>
              {chip.label}
              <FaTimes className="filter-chip-x" />
            </button>
          ))}
          <button type="button" className="filter-clear" onClick={() => commit({ ...emptyFilters, type: filters.type })}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenus;
