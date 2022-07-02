// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

#[derive(Debug, Clone, PartialEq)]
pub struct TeamsSchedule {
    pub combination: Combination,
    pub teams_info: Teams,
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
