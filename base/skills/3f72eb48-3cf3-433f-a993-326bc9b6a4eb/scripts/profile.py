#!/usr/bin/env python3
"""Quick dataset profile — shape, nulls, and value ranges for a CSV or
Parquet file. Run before any analysis so you know what you're dealing with.

Usage:
    python scripts/profile.py path/to/data.csv
    python scripts/profile.py path/to/data.parquet
"""

import sys
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    sys.stderr.write("pandas is required: pip install pandas\n")
    sys.exit(1)


def main(path: Path) -> None:
    if path.suffix == ".parquet":
        df = pd.read_parquet(path)
    else:
        df = pd.read_csv(path)

    print(f"shape: {df.shape[0]:,} rows × {df.shape[1]} cols")
    print()
    print("column            dtype           non-null   nulls   unique   sample")
    print("-" * 78)
    for col in df.columns:
        s = df[col]
        sample = s.dropna().head(1).to_list()
        sample_repr = repr(sample[0])[:24] if sample else ""
        print(
            f"{col[:18]:<18}{str(s.dtype):<16}"
            f"{s.notna().sum():>10,}{s.isna().sum():>8,}"
            f"{s.nunique(dropna=True):>9,}   {sample_repr}"
        )


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.stderr.write("usage: profile.py <data-file>\n")
        sys.exit(2)
    main(Path(sys.argv[1]))
