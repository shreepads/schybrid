// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use teams_info::Teams;
use teams_info::Combination;

#[derive(Debug, Clone, PartialEq)]
pub struct TeamsSchedule {
    pub combination: Combination,
    pub teams_info: Teams,
    pub seats: u64,
}

impl TeamsSchedule {

    pub fn new(teams_info: Teams, combination: Combination, seats: u64) -> TeamsSchedule {
        TeamsSchedule {
            combination,
            teams_info,
            seats,
        }
    }

}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
