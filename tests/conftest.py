import sys
import os
from pathlib import Path

# Add the parent directory to the path so that imports work correctly
sys.path.insert(0, str(Path(__file__).parent.parent)) 