import { useState, useEffect, useRef, useMemo } from 'react';
import { getPresenceLatest, getHealth } from '../../APIFunctions/Radar';

const REFRESH_INTERVAL_MS = 5000;
const SVG_HEIGHT = 380;
const MAX_RADIUS = 155;
const RING_DISTANCES = [5, 10, 15, 20];
const RADAR_MAX_DIST = RING_DISTANCES[RING_DISTANCES.length - 1];

const LERP = 0.1;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function RadarViz({ devices }) {
  const containerRef = useRef(null);
  const [svgWidth, setSvgWidth] = useState(380);
  const [hoveredId, setHoveredId] = useState(null);
  const deviceAngles = useRef(new Map());
  const deviceSlotCount = useRef(0);
  const displayPos = useRef({});
  const animFrame = useRef(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      setSvgWidth(Math.floor(entries[0].contentRect.width));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cx = svgWidth / 2;
  const cy = SVG_HEIGHT / 2;

  devices?.forEach(device => {
    if (!deviceAngles.current.has(device.device_id)) {
      deviceAngles.current.set(
        device.device_id,
        deviceSlotCount.current++ * GOLDEN_ANGLE - Math.PI / 2
      );
    }
  });

  const targetPoints = useMemo(() => {
    if (!devices?.length) return [];
    return devices.map(device => {
      const angle = deviceAngles.current.get(device.device_id) ?? 0;
      const r = Math.min(device.distance_m / RADAR_MAX_DIST, 1) * MAX_RADIUS;
      return {
        ...device,
        angle,
        tx: cx + r * Math.cos(angle),
        ty: cy + r * Math.sin(angle),
      };
    });
  }, [devices, cx, cy]);

  useEffect(() => {
    const currentIds = new Set(targetPoints.map(pt => pt.device_id));
    Object.keys(displayPos.current).forEach(id => {
      if (!currentIds.has(id)) delete displayPos.current[id];
    });
    targetPoints.forEach(pt => {
      if (!displayPos.current[pt.device_id]) {
        displayPos.current[pt.device_id] = { x: pt.tx, y: pt.ty };
      }
    });

    function animate() {
      let needsMore = false;
      targetPoints.forEach(pt => {
        const cur = displayPos.current[pt.device_id];
        const nx = cur.x + (pt.tx - cur.x) * LERP;
        const ny = cur.y + (pt.ty - cur.y) * LERP;
        if (Math.abs(pt.tx - nx) > 0.3 || Math.abs(pt.ty - ny) > 0.3) needsMore = true;
        displayPos.current[pt.device_id] = { x: nx, y: ny };
      });
      forceUpdate(n => n + 1);
      if (needsMore) animFrame.current = requestAnimationFrame(animate);
    }

    cancelAnimationFrame(animFrame.current);
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [targetPoints]);

  if (!devices || devices.length === 0) {
    return (
      <div ref={containerRef} className='w-full'>
        <p className='text-gray-400 text-sm text-center'>No devices detected</p>
      </div>
    );
  }

  const points = targetPoints.map(pt => ({
    ...pt,
    x: displayPos.current[pt.device_id]?.x ?? pt.tx,
    y: displayPos.current[pt.device_id]?.y ?? pt.ty,
  }));

  return (
    <div ref={containerRef} className='w-full'>
      <svg viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT}`} width='100%' height={SVG_HEIGHT}>
        {RING_DISTANCES.map((dist, i) => {
          const ringR = (dist / RADAR_MAX_DIST) * MAX_RADIUS;
          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={ringR}
                fill='none'
                stroke='rgba(99,102,241,0.25)'
                strokeWidth='1'
              />
              <text x={cx + 4} y={cy - ringR + 11} fontSize='9' fill='#9ca3af'>
                {dist}m
              </text>
            </g>
          );
        })}

        <line
          x1={cx} y1={cy - MAX_RADIUS - 6}
          x2={cx} y2={cy + MAX_RADIUS + 6}
          stroke='rgba(99,102,241,0.15)' strokeWidth='1'
        />
        <line
          x1={cx - MAX_RADIUS - 6} y1={cy}
          x2={cx + MAX_RADIUS + 6} y2={cy}
          stroke='rgba(99,102,241,0.15)' strokeWidth='1'
        />

        {points.map(pt => (
          <line
            key={`line-${pt.device_id}`}
            x1={cx} y1={cy} x2={pt.x} y2={pt.y}
            stroke='rgba(99,102,241,0.2)' strokeWidth='1' strokeDasharray='3,3'
          />
        ))}

        {points.map(pt => {
          const label = pt.alias || pt.device_id;
          const pad = 16;
          const lx = pt.x + pad * Math.cos(pt.angle);
          const ly = pt.y + pad * Math.sin(pt.angle);
          const anchor =
            Math.abs(Math.cos(pt.angle)) < 0.3
              ? 'middle'
              : Math.cos(pt.angle) > 0
                ? 'start'
                : 'end';
          const hovered = hoveredId === pt.device_id;
          return (
            <g
              key={`pt-${pt.device_id}`}
              onMouseEnter={() => setHoveredId(pt.device_id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={pt.x} cy={pt.y} r={12} fill='transparent' />
              <circle cx={pt.x} cy={pt.y} r={5} fill='rgb(99,102,241)' />
              {hovered && (
                <text
                  x={lx} y={ly} fontSize='9' fill='#e5e7eb'
                  textAnchor={anchor} dominantBaseline='middle'
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r={7} fill='rgb(99,102,241)' stroke='white' strokeWidth='2' />
        <text x={cx} y={cy + 20} fontSize='10' fill='#9ca3af' textAnchor='middle'>
          SCE
        </text>
      </svg>
    </div>
  );
}

export default function Radar() {
  const [status, setStatus] = useState(0);
  const [count, setCount] = useState(0);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function fetchOccupancy() {
    const res = await getPresenceLatest();
    if (res.error || !res.responseData?.ok) {
      const healthRes = await getHealth();
      setError(healthRes.error);
    } else {
      const { data } = res.responseData;
      const filtered = (data || []).filter(item => {
        const p = item.payload;
        if (!p || p.int < 50) return false;
        if (!p.id || !p.id.startsWith('apple:10')) return false;
        return true;
      });
      const c = filtered.length;
      setCount(c);
      setDevices(filtered);
      let finalStatus = 'Dead';
      if (c >= 3 && c < 7) {
        finalStatus = 'Quiet';
      } else if (c >= 7 && c < 13) {
        finalStatus = 'Active';
      } else {
        finalStatus = 'Busy';
      }
      setStatus(finalStatus);
    }
    setLastUpdated(new Date());
    setLoading(false);
  }

  useEffect(() => {
    fetchOccupancy();
    const interval = setInterval(fetchOccupancy, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  function renderContent() {
    if (loading) {
      return (
        <div className='flex flex-col items-center gap-4'>
          <span className='loading loading-spinner loading-lg text-primary' />
          <p className='text-gray-500 dark:text-gray-400'>Loading radar...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='flex flex-col items-center gap-4'>
          <p className='text-xl font-semibold text-gray-700 dark:text-gray-200'>
            Sensor unavailable
          </p>
          <p className='text-gray-500 dark:text-gray-400 text-sm text-center'>
            The radar sensor may be offline. Try again later.
            <span className='block'>Error: {error}</span>
          </p>
        </div>
      );
    }

    return (
      <div className='flex flex-col items-center gap-4 w-full'>
        <div className='flex items-baseline gap-2'>
          <span className='text-4xl font-bold text-indigo-500'>{count}</span>
          <span className='text-gray-500 dark:text-gray-400 text-sm'>
            devices &mdash; {status}
          </span>
        </div>
        <RadarViz devices={devices} />
      </div>
    );
  }

  return (
    <div className='min-h-[100dvh] bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-600 flex flex-col items-center justify-center px-4'>
      <div className='w-[60vw] bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-white tracking-tight'>
          SCE Radar
        </h1>
        {renderContent()}
        {lastUpdated && !loading && (
          <div className='flex flex-col items-center gap-2'>
            <p className='text-xs text-gray-400 dark:text-gray-500'>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <button
              className='btn btn-sm btn-ghost text-gray-500 dark:text-gray-400'
              onClick={fetchOccupancy}
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
